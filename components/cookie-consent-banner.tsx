"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "resto-cookie-notice-dismissed";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Information cookies"
      className={cn(
        "fixed inset-x-3 top-[4.75rem] z-40 rounded-2xl border border-zinc-800 bg-[var(--resto-surface)] p-4",
        "sm:left-auto sm:right-4 sm:max-w-sm"
      )}
    >
      <p className="text-center text-sm leading-snug text-[var(--resto-ink)]/90 sm:text-base">
        Carte Google Maps et hébergement peuvent déposer des cookies ou traceurs.{" "}
        <Link
          href="/politique-de-confidentialite"
          className="font-semibold text-[var(--resto-brand)] underline-offset-2 hover:underline"
        >
          Politique de confidentialité
        </Link>
        .
      </p>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* ignore */
            }
            setVisible(false);
          }}
          className="min-h-11 rounded-lg border border-white bg-white px-5 text-sm font-medium text-black transition-colors duration-200 hover:bg-neutral-200"
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
