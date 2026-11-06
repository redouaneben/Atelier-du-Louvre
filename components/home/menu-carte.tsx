"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { AllergenButton } from "@/components/menu/allergen-dialog";
import { FacebookLink } from "@/components/facebook-link";
import { siteConfig } from "@/config/site";
import { ALLERGEN_DISCLAIMER } from "@/data/allergens";
import {
  formatPrice,
  MENU_SECTIONS,
  type MenuItem,
} from "@/data/menu";
import { display } from "@/lib/fonts";
import { GLASS_PANEL, PAGE_SHELL } from "@/lib/page-shell";
import {
  menuToggleActive,
  menuToggleInactive,
  menuToggleInactiveHover,
  restoButtonBase,
  restoButtonClass,
} from "@/lib/resto-button";
import { cn } from "@/lib/utils";

function sectionFromHash() {
  const id = window.location.hash.replace("#", "");
  return MENU_SECTIONS.some((section) => section.id === id)
    ? id
    : MENU_SECTIONS[0].id;
}

function Price({ item }: { item: MenuItem }) {
  const label =
    item.priceLabel ?? (item.price === null ? null : formatPrice(item.price));
  if (!label) return null;
  return (
    <p className="shrink-0 text-lg font-medium tabular-nums text-white">
      {label}
    </p>
  );
}

function DishDetail({ text }: { text: string }) {
  return <span className="text-neutral-400">{text}</span>;
}

export function MenuCarte() {
  const [activeId, setActiveId] = useState(MENU_SECTIONS[0].id);
  const section =
    MENU_SECTIONS.find((item) => item.id === activeId) ?? MENU_SECTIONS[0];

  useEffect(() => {
    const id = sectionFromHash();
    setActiveId(id);
    if (!window.location.hash) return;
    const timer = window.setTimeout(() => {
      document.getElementById("carte")?.scrollIntoView({ block: "start" });
    }, 40);
    return () => window.clearTimeout(timer);
  }, []);

  function selectSection(id: string) {
    setActiveId(id);
    const next = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.replaceState(null, "", next);
  }

  return (
    <section id="carte" className="scroll-mt-20 pb-16 pt-10 sm:scroll-mt-24 sm:pb-20 sm:pt-16">
      <div className={PAGE_SHELL}>
        <div className="mb-6 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--resto-brand)]">
            La carte
          </p>
          <span className="mt-4 block h-px w-10 bg-[var(--resto-brand)]" aria-hidden />
          <h2
            className={cn(
              display.className,
              "mt-3 text-4xl font-medium tracking-tight text-neutral-100 sm:text-5xl"
            )}
          >
            Midi, ou soir et week-end
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-neutral-300">
            Deux cartes différentes. Le midi en début de semaine n&apos;est pas le menu du soir.
          </p>
        </div>

        <div className="sticky top-20 z-30 -mx-5 mb-4 overflow-x-auto bg-[var(--resto-paper)] px-5 py-3 [scrollbar-width:none] sm:top-24 sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
          <div
            role="tablist"
            aria-label="Rubriques de la carte"
            className="flex w-max gap-x-6"
          >
          {MENU_SECTIONS.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={active}
                aria-controls={`panel-${item.id}`}
                onClick={() => selectSection(item.id)}
                className={cn(
                  restoButtonBase,
                  "h-9 shrink-0 snap-start px-3 text-sm",
                  active
                    ? menuToggleActive
                    : cn(menuToggleInactive, menuToggleInactiveHover.forest)
                )}
              >
                {item.nav}
              </button>
            );
          })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={section.id}
            role="tabpanel"
            id={`panel-${section.id}`}
            aria-labelledby={`tab-${section.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(GLASS_PANEL, "px-5 py-6 sm:px-8 sm:py-8")}
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                className={cn(
                  display.className,
                  "min-w-0 text-4xl font-medium tracking-tight text-neutral-100 sm:text-5xl"
                )}
              >
                {section.title}
              </h3>
              {section.menuPrice != null ? (
                <p className="shrink-0 pt-1 text-2xl font-medium tabular-nums text-white sm:pt-2 sm:text-3xl">
                  {formatPrice(section.menuPrice)}
                </p>
              ) : null}
            </div>
            <span className="mt-4 block h-px w-10 bg-[var(--resto-brand)]" aria-hidden />
            {section.when ? (
              <p className="mt-4 text-base font-medium text-[var(--resto-brand)] sm:text-lg">
                {section.when}
              </p>
            ) : null}
            <div className="mt-3 max-w-2xl space-y-2 text-sm leading-relaxed text-neutral-400 sm:text-base">
              {section.id === "midi" ? (
                <p>
                  Ces formules ne sont pas servies le soir, ni le mardi ou le mercredi.
                </p>
              ) : section.intro ? (
                <p>{section.intro}</p>
              ) : null}
              {section.id === "midi" ? (
                <p>
                  Le plat du jour change. Il est affiché au restaurant
                  {siteConfig.facebook.href ? (
                    <>
                      {" et sur "}
                      <FacebookLink className="font-medium text-[var(--resto-brand)]" />.
                    </>
                  ) : (
                    "."
                  )}
                </p>
              ) : null}
            </div>
            <div>
              {section.blocks.map((block) => (
                <div key={block.label ?? "principal"} className="mt-10">
                  {block.label ? (
                    <div>
                      <p className="text-lg font-medium uppercase tracking-[0.2em] text-[var(--resto-brand)] sm:text-xl">
                        {block.label}
                      </p>
                      <span className="mt-3 block h-px w-10 bg-[var(--resto-brand)]" aria-hidden />
                    </div>
                  ) : null}
                  {block.note ? (
                    <p className="mt-1 text-base leading-relaxed text-neutral-400">
                      {block.note}
                    </p>
                  ) : null}
                  {block.items.map((item) => (
                    <article
                      key={item.name}
                      className="border-b-2 border-zinc-400 py-5 last:border-b-0"
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1">
                        <h4
                          className={cn(
                            display.className,
                            "min-w-0 text-2xl font-medium leading-tight text-neutral-100 sm:text-3xl"
                          )}
                        >
                          {item.name}
                        </h4>
                        <Price item={item} />
                        {item.ingredients ? (
                          <p className="text-base leading-relaxed text-neutral-400">
                            <DishDetail text={item.ingredients} />
                          </p>
                        ) : null}
                        {item.allergenInfo ? (
                          <div className={cn("flex justify-end", !item.ingredients && "col-start-2")}>
                            <AllergenButton
                              dish={item.name}
                              items={item.allergenInfo.items}
                              note={item.allergenInfo.note}
                            />
                          </div>
                        ) : null}
                      </div>
                      {item.call ? (
                        <div className="mt-3">
                          <a
                            href={siteConfig.phone.href}
                            className={cn(restoButtonClass("primary", "sm"), "tabular-nums")}
                          >
                            <Phone className="h-3.5 w-3.5" aria-hidden />
                            Appeler le {siteConfig.phone.display}
                          </a>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              ))}
            </div>
            {section.footnote ||
            section.blocks.some((block) => block.items.some((item) => item.allergenInfo)) ? (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-400">
                {section.blocks.some((block) => block.items.some((item) => item.allergenInfo)) ? (
                  <p className="flex items-center gap-2">
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white font-sans text-sm font-bold leading-none text-neutral-950"
                      aria-hidden
                    >
                      i
                    </span>
                    Allergènes
                  </p>
                ) : null}
                {section.footnote ? <p>{section.footnote}</p> : null}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <p className="mt-6 text-base leading-relaxed text-neutral-300">
          {ALLERGEN_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
