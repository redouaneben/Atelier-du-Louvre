"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { ReserveButton } from "@/components/reservation/reserve-button";
import { siteConfig } from "@/config/site";
import {
  getOpenStatus,
  getParisDate,
  type OpenStatus,
} from "@/data/hours";
import { PAGE_SHELL } from "@/lib/page-shell";
import { restoButtonClass } from "@/lib/resto-button";
import { cn } from "@/lib/utils";

import logo from "../../IMGS/LOGO-BLANC-2.png";

const INITIAL_STATUS: OpenStatus = {
  isOpen: false,
  subline: "",
  source: "normal",
};

export function useRestaurantStatus() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<OpenStatus>(INITIAL_STATUS);

  useEffect(() => {
    setMounted(true);
    const refresh = () => setStatus(getOpenStatus(getParisDate()));
    refresh();
    const interval = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return { mounted, status };
}

export function SiteHeader({
  mounted,
  status,
}: {
  mounted: boolean;
  status: OpenStatus;
}) {
  const label = !mounted
    ? "…"
    : (status.headline ?? (status.isOpen ? "Ouvert" : "Fermé"));
  const subline = mounted ? status.subline : "";

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[var(--resto-paper)]">
      <div className={cn(PAGE_SHELL, "flex h-20 items-center gap-2 sm:h-24 sm:gap-3")}>
        <a href="#accueil" className="min-w-0 flex-1">
          <Image
            src={logo}
            alt={siteConfig.name}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </a>

        <div
          role="status"
          aria-live="polite"
          className="flex max-w-[7.5rem] items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 sm:max-w-none sm:px-3"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            {mounted && status.isOpen ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--resto-accent)] opacity-70" />
            ) : null}
            <span
              className={cn(
                "relative h-2 w-2 rounded-full",
                !mounted && "bg-neutral-600",
                mounted && status.isOpen && "bg-[var(--resto-accent)]",
                mounted && !status.isOpen && "bg-neutral-500"
              )}
            />
          </span>
          <span className="min-w-0 leading-tight">
            <AnimatePresence mode="wait">
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="block truncate text-sm font-medium text-neutral-100"
              >
                {label}
              </motion.span>
            </AnimatePresence>
            {subline ? (
              <span className="hidden truncate text-xs text-neutral-400 min-[480px]:block">
                {subline}
              </span>
            ) : null}
          </span>
        </div>

        <ReserveButton className={restoButtonClass("primary", "sm", "px-3.5 sm:px-5")}>
          Réserver
        </ReserveButton>
      </div>
    </header>
  );
}
