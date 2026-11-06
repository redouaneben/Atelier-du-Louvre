"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, Mail, Minus, Phone, Plus, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  getBookingDay,
  getParisDateKey,
  parseDateInput,
  type MealServiceId,
} from "@/data/hours";
import { formatPrice } from "@/data/menu";
import { orderCatalogFor, type OrderItem, type OrderOffer } from "@/data/order-catalog";
import { display } from "@/lib/fonts";
import {
  isEmail,
  isPhone,
  type BookingMode,
  type ContactChannel,
} from "@/lib/reservation-request";
import { restoButtonClass } from "@/lib/resto-button";
import { cn } from "@/lib/utils";

type ReservationPreset = {
  service?: MealServiceId;
};

type OrderStyle = "formule" | "carte";

type FormState = {
  mode: BookingMode;
  orderStyle: OrderStyle;
  guests: number;
  date: string;
  service: MealServiceId | "";
  name: string;
  phone: string;
  email: string;
  contact: ContactChannel | "";
  qty: Record<string, number>;
};

type OrderedLine = OrderItem & { qty: number };
type SubmittedView = FormState & { lines: OrderedLine[]; total: number };

const EMPTY_FORM: FormState = {
  mode: "table",
  orderStyle: "formule",
  guests: 2,
  date: "",
  service: "",
  name: "",
  phone: "",
  email: "",
  contact: "",
  qty: {},
};

const EMPTY_OFFER: OrderOffer = {
  formulas: [],
  carte: [],
  supplements: [],
  bambins: [],
  items: [],
};

export function ReservationSheet({
  open,
  preset,
  onClose,
}: {
  open: boolean;
  preset: ReservationPreset | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "items", string>>>({});
  const [submitted, setSubmitted] = useState<SubmittedView | null>(null);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const booking = form.date ? getBookingDay(parseDateInput(form.date)) : null;
  const offer: OrderOffer =
    form.mode === "emporter" && form.date && form.service
      ? orderCatalogFor(form.date, form.service)
      : EMPTY_OFFER;
  const formulaQty = offer.formulas.reduce((sum, item) => sum + (form.qty[item.id] ?? 0), 0);
  const visible =
    form.orderStyle === "formule"
      ? [...offer.formulas, ...(formulaQty > 0 ? offer.supplements : []), ...offer.bambins]
      : [...offer.carte.flatMap((group) => group.items), ...offer.bambins];
  const lines: OrderedLine[] = visible
    .map((item) => ({ ...item, qty: form.qty[item.id] ?? 0 }))
    .filter((item) => item.qty > 0);
  const total = lines.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    if (open && !wasOpen.current) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setSubmitted(null);
      setSubmitError(null);
      setErrors({});
      setForm((current) => ({
        ...current,
        date: current.date || getParisDateKey(),
        service: preset?.service ?? current.service,
      }));
      const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);
      wasOpen.current = true;
      return () => window.clearTimeout(focusTimer);
    }

    if (!open && wasOpen.current) {
      wasOpen.current = false;
      setSubmitted(null);
      previouslyFocused.current?.focus();
    }
  }, [open, preset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!booking || !form.service) return;
    const selected = booking.services.find((service) => service.id === form.service);
    if (!selected || selected.ended) {
      setForm((current) => ({ ...current, service: "" }));
    }
  }, [booking, form.service]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function setQty(id: string, next: number) {
    setForm((current) => ({
      ...current,
      qty: { ...current.qty, [id]: Math.max(0, Math.min(10, next)) },
    }));
    setErrors((current) => ({ ...current, items: undefined }));
  }

  function setOrderStyle(orderStyle: OrderStyle) {
    setForm((current) => {
      const hidden = new Set(
        (orderStyle === "formule"
          ? offer.carte.flatMap((group) => group.items)
          : [...offer.formulas, ...offer.supplements]
        ).map((item) => item.id)
      );
      const qty = Object.fromEntries(Object.entries(current.qty).filter(([id]) => !hidden.has(id)));
      return { ...current, orderStyle, qty };
    });
    setErrors((current) => ({ ...current, items: undefined }));
  }

  async function submit() {
    const nextErrors: Partial<Record<keyof FormState | "items", string>> = {};
    if (!form.date) nextErrors.date = "Choisissez une date.";
    else if (booking?.closed) nextErrors.date = booking.reason;
    if (!form.service) nextErrors.service = "Choisissez le midi ou le soir.";
    if (form.mode === "emporter" && lines.length === 0) {
      nextErrors.items = "Choisissez au moins un plat.";
    }
    if (form.name.trim().length < 2) nextErrors.name = "Indiquez un nom.";
    if (!isPhone(form.phone)) nextErrors.phone = "Indiquez un téléphone joignable.";
    if (!isEmail(form.email)) nextErrors.email = "Indiquez un e-mail valide.";
    if (!form.contact) nextErrors.contact = "Choisissez SMS ou e-mail.";

    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      mode: form.mode,
      guests: form.guests,
      date: form.date,
      service: form.service,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      contact: form.contact,
      items: lines.map((item) => ({ id: item.id, qty: item.qty })),
    };

    setSending(true);
    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        setSubmitError(
          body?.message ?? "La demande n'a pas pu être envoyée. Réessayez ou appelez le restaurant."
        );
        return;
      }
      setSubmitted({
        ...form,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        lines,
        total,
      });
    } catch {
      setSubmitError("La demande n'a pas pu être envoyée. Réessayez ou appelez le restaurant.");
    } finally {
      setSending(false);
    }
  }

  const summaryDate = submitted
    ? new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(parseDateInput(submitted.date))
    : "";

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Fermer la réservation"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed z-[51] flex max-h-[min(92svh,44rem)] w-full flex-col overflow-hidden",
              "border border-zinc-800 bg-[var(--resto-surface)]",
              "inset-x-0 bottom-0 rounded-t-2xl",
              "md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
            )}
          >
            <div className="mx-auto mt-3 h-1 w-10 rounded-lg bg-neutral-700 md:hidden" />
            <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-4 sm:px-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--resto-brand)]">
                  {siteConfig.shortName}
                </p>
                <h2
                  id={titleId}
                  className={cn(display.className, "mt-1 text-3xl font-medium text-neutral-100")}
                >
                  {submitted
                    ? "Demande envoyée"
                    : form.mode === "emporter"
                      ? "À emporter"
                      : "Réserver"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 text-neutral-200 transition-colors duration-200 hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
                <p className="text-base leading-relaxed text-neutral-300">
                  {siteConfig.name} va{" "}
                  {submitted.mode === "emporter"
                    ? "confirmer votre commande"
                    : "valider votre table"}{" "}
                  rapidement. La confirmation arrivera{" "}
                  {submitted.contact === "sms" ? "par SMS" : "par e-mail"}.
                </p>
                <dl className="mt-5 space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-base">
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400">
                      {submitted.mode === "emporter" ? "Commande" : "Convives"}
                    </dt>
                    <dd className="text-right text-neutral-100">
                      {submitted.mode === "emporter"
                        ? submitted.lines.map((item) => `${item.qty} × ${item.name}`).join(", ")
                        : submitted.guests}
                    </dd>
                  </div>
                  {submitted.mode === "emporter" ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-400">Total</dt>
                      <dd className="text-neutral-100">{formatPrice(submitted.total)}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400">Date</dt>
                    <dd className="capitalize text-neutral-100">{summaryDate}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400">Service</dt>
                    <dd className="text-neutral-100">
                      {submitted.service === "midi" ? "Midi" : "Soir"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400">Nom</dt>
                    <dd className="text-neutral-100">{submitted.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400">Téléphone</dt>
                    <dd className="text-neutral-100">{submitted.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400">E-mail</dt>
                    <dd className="break-all text-right text-neutral-100">{submitted.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-400">Confirmation</dt>
                    <dd className="text-neutral-100">
                      {submitted.contact === "sms" ? "Par SMS" : "Par e-mail"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 grid gap-3">
                  <a
                    href={siteConfig.phone.href}
                    className={restoButtonClass("primary", "md", "w-full")}
                  >
                    <Phone className="h-4 w-4" />
                    Appeler pour confirmer
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(null)}
                    className={restoButtonClass("secondary", "md", "w-full")}
                  >
                    Modifier la demande
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <p className="text-base leading-relaxed text-neutral-300">
                  Une table, ou une commande à emporter. Puis le jour, et comment
                  vous préférez être contacté.
                </p>

                <div className="mt-5 space-y-4">
                  <Field label="Vous venez pour">
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ["table", "Une table"],
                          ["emporter", "À emporter"],
                        ] as const
                      ).map(([value, label]) => {
                        const selected = form.mode === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => update("mode", value)}
                            className={cn(
                              "min-h-10 rounded-lg border px-3 text-sm font-medium transition-colors duration-200",
                              selected
                                ? "border-[var(--resto-brand)] bg-[var(--resto-brand)] text-neutral-950"
                                : "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950"
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  {form.mode === "table" ? (
                  <Field label="Convives" error={errors.guests}>
                    <div className="flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-900 px-2">
                      <button
                        type="button"
                        aria-label="Retirer un convive"
                        disabled={form.guests <= 1}
                        onClick={() => update("guests", form.guests - 1)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-neutral-100 transition-colors duration-200 hover:bg-neutral-800 disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-base font-medium tabular-nums text-neutral-100">
                        {form.guests}
                      </span>
                      <button
                        type="button"
                        aria-label="Ajouter un convive"
                        disabled={form.guests >= 10}
                        onClick={() => update("guests", form.guests + 1)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-neutral-100 transition-colors duration-200 hover:bg-neutral-800 disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {form.guests >= 8 ? (
                      <p className="mt-2 text-sm text-neutral-400">
                        Au-delà de 8 couverts, les menus de groupes se confirment avec {siteConfig.reservation.contactName}.
                      </p>
                    ) : null}
                  </Field>
                  ) : null}

                  <Field label="Date" error={errors.date}>
                    <input
                      type="date"
                      required
                      aria-label="Date"
                      min={getParisDateKey()}
                      value={form.date}
                      onChange={(event) => update("date", event.target.value)}
                      className={inputClass}
                    />
                    {booking?.closed ? (
                      <p className="mt-2 text-sm text-neutral-300">{booking.reason}. Choisissez un autre jour.</p>
                    ) : null}
                  </Field>

                  <Field label="Service" error={errors.service}>
                    <div className="grid grid-cols-2 gap-2">
                      {(["midi", "soir"] as const).map((id) => {
                        const service = booking?.services.find((item) => item.id === id);
                        const disabled = !service || service.ended || Boolean(booking?.closed);
                        const selected = form.service === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            aria-pressed={selected}
                            disabled={disabled || !form.date}
                            onClick={() => update("service", id)}
                            className={cn(
                              "min-h-10 rounded-lg border px-3 text-sm font-medium transition-colors duration-200",
                              selected
                                ? "border-[var(--resto-brand)] bg-[var(--resto-brand)] text-neutral-950"
                                : "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950",
                              (disabled || !form.date) &&
                                "opacity-40 hover:border-white hover:bg-white hover:text-black"
                            )}
                          >
                            <span className="block">{id === "midi" ? "Midi" : "Soir"}</span>
                            <span className={cn("mt-0.5 block text-xs font-medium", selected ? "text-neutral-800" : "text-neutral-600")}>
                              {!form.date
                                ? "Choisir une date"
                                : service?.ended
                                  ? "Service terminé"
                                  : service
                                    ? service.hint
                                    : "Fermé"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  {form.mode === "emporter" && form.date && form.service ? (
                    <Field label="Votre commande" error={errors.items}>
                      {offer.items.length === 0 ? (
                        <p className="text-base leading-relaxed text-neutral-300">
                          Pas de vente à emporter sur ce service. Choisissez un autre jour.
                        </p>
                      ) : (
                        <div>
                          <div className="grid grid-cols-2 gap-2">
                            {(
                              [
                                ["formule", "Une formule"],
                                ["carte", "À la carte"],
                              ] as const
                            ).map(([value, label]) => {
                              const selected = form.orderStyle === value;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  aria-pressed={selected}
                                  onClick={() => setOrderStyle(value)}
                                  className={cn(
                                    "min-h-10 rounded-lg border px-3 text-sm font-medium transition-colors duration-200",
                                    selected
                                      ? "border-[var(--resto-brand)] bg-[var(--resto-brand)] text-neutral-950"
                                      : "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950"
                                  )}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                            {form.orderStyle === "formule"
                              ? "Un lot, moins cher que les plats séparés. Indiquez le nombre de menus."
                              : "Chaque plat est commandé seul, sans formule."}
                          </p>

                          {form.orderStyle === "formule" ? (
                            <ul className="mt-4 space-y-3">
                              {offer.formulas.map((item) => (
                                <OrderRow key={item.id} item={item} qty={form.qty[item.id] ?? 0} onQty={setQty} card />
                              ))}
                            </ul>
                          ) : (
                            <div className="mt-5 space-y-6">
                              {offer.carte.map((group) => (
                                <div key={group.label}>
                                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--resto-brand)]">
                                    {group.label}
                                  </p>
                                  <ul className="mt-1">
                                    {group.items.map((item) => (
                                      <OrderRow key={item.id} item={item} qty={form.qty[item.id] ?? 0} onQty={setQty} />
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          {form.orderStyle === "formule" && formulaQty > 0 && offer.supplements.length > 0 ? (
                            <div className="mt-6">
                              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--resto-brand)]">
                                Suppléments
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                                Le dessert de l&apos;ardoise est déjà dans la formule.
                              </p>
                              <ul className="mt-1">
                                {offer.supplements.map((item) => (
                                  <OrderRow key={item.id} item={item} qty={form.qty[item.id] ?? 0} onQty={setQty} />
                                ))}
                              </ul>
                            </div>
                          ) : null}

                          {offer.bambins.length > 0 ? (
                            <div className="mt-6">
                              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--resto-brand)]">
                                Bambins
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                                Jusqu&apos;à 12 ans. Un plat, une boisson et un dessert.
                              </p>
                              <ul className="mt-1">
                                {offer.bambins.map((item) => (
                                  <OrderRow key={item.id} item={item} qty={form.qty[item.id] ?? 0} onQty={setQty} />
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      )}
                      {lines.length > 0 ? (
                        <p className="mt-4 text-right text-base font-medium tabular-nums text-white">
                          Total {formatPrice(total)}
                        </p>
                      ) : null}
                    </Field>
                  ) : null}

                  <Field label="Nom" error={errors.name}>
                    <input
                      type="text"
                      aria-label="Nom"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      className={inputClass}
                      placeholder="Votre nom"
                    />
                  </Field>

                  <Field label="Téléphone" error={errors.phone}>
                    <input
                      type="tel"
                      required
                      aria-label="Téléphone"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      className={inputClass}
                      placeholder="06 12 34 56 78"
                    />
                  </Field>

                  <Field label="E-mail" error={errors.email}>
                    <input
                      type="email"
                      required
                      aria-label="E-mail"
                      autoComplete="email"
                      inputMode="email"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      className={inputClass}
                      placeholder="vous@email.fr"
                    />
                  </Field>

                  <div>
                    <p id={`${titleId}-contact`} className="mb-2 text-base leading-snug text-neutral-200">
                      Comment souhaitez-vous être contacté pour la confirmation ?
                    </p>
                    <div
                      role="radiogroup"
                      aria-labelledby={`${titleId}-contact`}
                      className="grid grid-cols-2 gap-2"
                    >
                      {(
                        [
                          ["sms", "Par SMS"],
                          ["email", "Par e-mail"],
                        ] as const
                      ).map(([value, label]) => {
                        const selected = form.contact === value;
                        return (
                          <label
                            key={value}
                            className={cn(
                              "flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors duration-200 focus-within:ring-2 focus-within:ring-white/70",
                              selected
                                ? "border-[var(--resto-brand)] bg-[var(--resto-brand)] text-neutral-950"
                                : "border-white bg-white text-black hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950"
                            )}
                          >
                            <input
                              type="radio"
                              name="contact"
                              value={value}
                              checked={selected}
                              onChange={() => update("contact", value)}
                              className="h-4 w-4 accent-[var(--resto-brand)]"
                            />
                            {value === "sms" ? (
                              <Phone className="h-4 w-4" aria-hidden />
                            ) : (
                              <Mail className="h-4 w-4" aria-hidden />
                            )}
                            {label}
                          </label>
                        );
                      })}
                    </div>
                    {errors.contact ? (
                      <span className="mt-2 block text-xs text-red-300">{errors.contact}</span>
                    ) : null}
                  </div>
                </div>

                {submitError ? (
                  <p className="mt-4 text-sm text-red-300" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={sending}
                  className={cn("mt-6 w-full", restoButtonClass("primary", "md"))}
                >
                  <Calendar className="h-4 w-4" />
                  {sending ? "Envoi…" : "Envoyer la demande"}
                </button>
                <p className="mt-3 text-center text-sm leading-relaxed text-neutral-400">
                  🔒 Demande sans engagement. Le restaurant vous confirmera{" "}
                  {form.mode === "emporter" ? "la commande et l'heure de retrait" : "votre table"}{" "}
                  par téléphone ou e-mail sous 24h.
                </p>
              </form>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

const inputClass =
  "min-h-12 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-base text-neutral-100 outline-none transition-colors duration-200 placeholder:text-neutral-600 focus:border-neutral-500";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </span>
      {children}
      {error ? <span className="mt-2 block text-xs text-red-300">{error}</span> : null}
    </div>
  );
}

function OrderRow({
  item,
  qty,
  onQty,
  card = false,
}: {
  item: OrderItem;
  qty: number;
  onQty: (id: string, next: number) => void;
  card?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-start justify-between gap-4",
        card
          ? "rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-4"
          : "border-b border-neutral-800 py-4 last:border-b-0"
      )}
    >
      <div className="min-w-0">
        <p className="text-base text-neutral-100">{item.name}</p>
        {item.detail ? (
          <p className="mt-1 text-sm leading-relaxed text-neutral-400">{item.detail}</p>
        ) : null}
        <p className="mt-1.5 text-sm tabular-nums text-white">{formatPrice(item.price)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Retirer ${item.name}`}
          disabled={qty === 0}
          onClick={() => onQty(item.id, qty - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-600 bg-neutral-800 text-neutral-100 disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center text-base tabular-nums text-neutral-100">{qty}</span>
        <button
          type="button"
          aria-label={`Ajouter ${item.name}`}
          disabled={qty >= 10}
          onClick={() => onQty(item.id, qty + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-600 bg-neutral-800 text-neutral-100 disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
