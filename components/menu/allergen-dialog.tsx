"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { ALLERGEN_DISCLAIMER, type DishAllergen } from "@/data/allergens";
import { display } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function AllergenButton({
  dish,
  items,
  note,
  className,
}: {
  dish: string;
  items: readonly DishAllergen[];
  note: string;
  className?: string;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Allergènes : ${dish}`}
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-sans text-sm font-bold leading-none text-neutral-950 transition-colors duration-200 hover:bg-[var(--resto-brand)]",
          className
        )}
      >
        i
      </button>
      {open && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
              <button
                type="button"
                aria-label="Fermer les allergènes"
                className="absolute inset-0"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-700 bg-[var(--resto-surface)] px-5 py-5 text-neutral-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-400">
                      Allergènes
                    </p>
                    <h3 id={titleId} className={cn(display.className, "mt-1 text-3xl leading-snug text-neutral-100")}>
                      {dish}
                    </h3>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Fermer"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-700 text-neutral-200 transition-colors duration-200 hover:border-[var(--resto-brand)] hover:bg-[var(--resto-brand)] hover:text-neutral-950"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {items.length > 0 ? (
                  <ul className="mt-4 divide-y divide-neutral-800 border-y border-neutral-800">
                    {items.map((item) => (
                      <li key={item.label} className="py-3">
                        <p className="text-base font-semibold text-neutral-100">{item.label}</p>
                        <p className="mt-1 text-base leading-relaxed text-neutral-200">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-4 text-base leading-relaxed text-neutral-200">{note}</p>
                <p className="mt-3 text-base leading-relaxed text-neutral-400">{ALLERGEN_DISCLAIMER}</p>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
