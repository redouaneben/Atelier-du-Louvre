import { getBookingDay, parseDateInput, type MealServiceId } from "@/data/hours";
import { orderCatalogFor } from "@/data/order-catalog";

export type ContactChannel = "sms" | "email";
export type BookingMode = "table" | "emporter";

export type OrderSelection = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

export type ReservationPayload = {
  mode: BookingMode;
  guests: number;
  date: string;
  service: MealServiceId;
  name: string;
  phone: string;
  email: string;
  contact: ContactChannel;
  items: OrderSelection[];
  total: number;
};

export function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function readReservationPayload(
  input: unknown
): { ok: true; value: ReservationPayload } | { ok: false; message: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Demande incomplète." };
  }

  const raw = input as Record<string, unknown>;
  const mode = raw.mode === "table" || raw.mode === "emporter" ? raw.mode : "";
  const guests = Number(raw.guests);
  const date = typeof raw.date === "string" ? raw.date : "";
  const service = raw.service === "midi" || raw.service === "soir" ? raw.service : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const phone = typeof raw.phone === "string" ? raw.phone.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const contact = raw.contact === "sms" || raw.contact === "email" ? raw.contact : "";

  if (!mode) {
    return { ok: false, message: "Choisissez une table ou l'à emporter." };
  }
  if (mode === "table" && (!Number.isInteger(guests) || guests < 1 || guests > 10)) {
    return { ok: false, message: "Indiquez le nombre de convives." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, message: "Choisissez une date." };
  }

  const booking = getBookingDay(parseDateInput(date));
  if (booking.closed) {
    return { ok: false, message: booking.reason };
  }
  if (!service) {
    return { ok: false, message: "Choisissez le midi ou le soir." };
  }

  const selected = booking.services.find((item) => item.id === service);
  if (!selected || selected.ended) {
    return { ok: false, message: "Ce service n'est pas disponible." };
  }
  if (name.length < 2) {
    return { ok: false, message: "Indiquez un nom." };
  }
  if (!isPhone(phone)) {
    return { ok: false, message: "Indiquez un téléphone joignable." };
  }
  if (!isEmail(email)) {
    return { ok: false, message: "Indiquez un e-mail valide." };
  }
  if (!contact) {
    return { ok: false, message: "Choisissez SMS ou e-mail." };
  }

  const catalog = orderCatalogFor(date, service);
  const requested = Array.isArray(raw.items) ? raw.items : [];
  const items: ReservationPayload["items"] = [];
  if (mode === "emporter") {
    for (const entry of requested) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const id = typeof row.id === "string" ? row.id : "";
      const qty = Number(row.qty);
      const known = catalog.items.find((item) => item.id === id);
      if (!known || !Number.isInteger(qty) || qty < 1 || qty > 10) continue;
      items.push({ id: known.id, name: known.name, qty, price: known.price });
    }
    if (items.length === 0) {
      return { ok: false, message: "Choisissez au moins un plat." };
    }
    const picked = items.map((row) => catalog.items.find((item) => item.id === row.id));
    const hasFormula = picked.some((item) => item?.kind === "formula");
    const hasCarte = picked.some((item) => item?.kind === "carte");
    const hasSupplement = picked.some((item) => item?.kind === "supplement");
    if (hasFormula && hasCarte) {
      return { ok: false, message: "Choisissez une formule ou l'à la carte." };
    }
    if (hasSupplement && !hasFormula) {
      return { ok: false, message: "Les suppléments s'ajoutent à une formule." };
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    ok: true,
    value: {
      mode,
      guests: mode === "table" ? guests : items.reduce((sum, item) => sum + item.qty, 0),
      date,
      service,
      name,
      phone,
      email,
      contact,
      items,
      total,
    },
  };
}
