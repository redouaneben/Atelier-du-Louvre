"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";

import { FacebookLink } from "@/components/facebook-link";
import { ReserveButton } from "@/components/reservation/reserve-button";
import {
  getAddressLines,
  getDirectionLinks,
  getFullAddress,
  siteConfig,
} from "@/config/site";
import { getParisDate, WEEK_SCHEDULE } from "@/data/hours";
import { display } from "@/lib/fonts";
import { GLASS_PANEL, PAGE_SHELL } from "@/lib/page-shell";
import { restoButtonClass } from "@/lib/resto-button";
import { cn } from "@/lib/utils";

const [ADDRESS_LINE_1, ADDRESS_LINE_2] = getAddressLines();

export function PracticalBlock() {
  const directions = getDirectionLinks();
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    setToday(getParisDate().getDay());
  }, []);

  return (
    <section id="infos" className="scroll-mt-20 py-4 pb-16 sm:scroll-mt-24 sm:pb-20">
      <div className={PAGE_SHELL}>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--resto-brand)]">
          Pratique
        </p>
        <span className="mt-4 block h-px w-10 bg-[var(--resto-brand)]" aria-hidden />
        <h2
          className={cn(
            display.className,
            "mt-3 text-4xl font-medium tracking-tight text-neutral-100 sm:text-5xl"
          )}
        >
          Adresse et horaires
        </h2>

        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          <article className={cn(GLASS_PANEL, "p-5 sm:p-6 lg:col-span-2")}>
            <div className="flex items-center gap-2 text-[var(--resto-brand)]">
              <MapPin className="h-4 w-4" aria-hidden />
              <p className="text-sm font-medium uppercase tracking-[0.18em]">
                Adresse
              </p>
            </div>
            <p className={cn(display.className, "mt-3 text-3xl font-medium text-neutral-100")}>
              {siteConfig.name}
            </p>
            <p className="mt-3 text-base leading-relaxed text-neutral-300">
              {ADDRESS_LINE_1}
              <br />
              {ADDRESS_LINE_2}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href={directions.google}
                target="_blank"
                rel="noopener noreferrer"
                className={restoButtonClass("primary", "sm", "w-full px-2")}
              >
                Google Maps
              </a>
              <a
                href={directions.waze}
                target="_blank"
                rel="noopener noreferrer"
                className={restoButtonClass("secondary", "sm", "w-full px-2")}
              >
                Waze
              </a>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-neutral-800">
              <iframe
                title={`${siteConfig.name} — ${getFullAddress()}`}
                src={siteConfig.map.embedUrl}
                className="h-52 w-full bg-neutral-900"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </article>

          <article className={cn(GLASS_PANEL, "p-5 sm:p-6 lg:col-span-2")}>
            <div className="flex items-center gap-2 text-[var(--resto-brand)]">
              <Clock className="h-4 w-4" aria-hidden />
              <p className="text-sm font-medium uppercase tracking-[0.18em]">
                Horaires
              </p>
            </div>
            <ul className="mt-4">
              {WEEK_SCHEDULE.map((row) => {
                const isToday = today === row.weekday;
                return (
                  <li
                    key={row.day}
                    className={cn(
                      "flex items-baseline justify-between gap-4 border-b border-neutral-800 py-3 text-base last:border-b-0",
                      isToday ? "rounded-lg bg-neutral-800/80 px-2 text-neutral-100" : "text-neutral-400",
                      row.closed && !isToday && "text-neutral-500"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {isToday ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--resto-brand)]" />
                      ) : null}
                      {row.day}
                    </span>
                    <span className="text-right">{row.detail}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-base leading-relaxed text-neutral-400">
              Mardi et mercredi : fermeture hebdomadaire. Taxes et service compris.
            </p>
          </article>

          <article className={cn(GLASS_PANEL, "flex flex-col p-5 sm:p-6 lg:col-span-1")}>
            <div className="flex items-center gap-2 text-[var(--resto-brand)]">
              <Phone className="h-4 w-4" aria-hidden />
              <p className="text-sm font-medium uppercase tracking-[0.18em]">
                Réservation
              </p>
            </div>
            <h3 className={cn(display.className, "mt-3 text-3xl font-medium text-neutral-100")}>
              Groupes
            </h3>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-neutral-300">
              <li>{siteConfig.reservation.groups}</li>
              <li>{siteConfig.reservation.corkage}</li>
              <li>
                {siteConfig.reservation.deposit} Contact :{" "}
                {siteConfig.reservation.contactName}.
              </li>
            </ul>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 text-base font-medium text-[var(--resto-brand)]"
            >
              {siteConfig.email}
            </a>
            <a
              href={siteConfig.phone.href}
              className="mt-2 text-base text-neutral-200"
            >
              {siteConfig.phone.display}
            </a>
            <FacebookLink className="mt-2 text-base font-medium text-[var(--resto-brand)]" />
            <ReserveButton className={cn("mt-6", restoButtonClass("primary", "sm", "w-full"))}>
              Réserver
            </ReserveButton>
          </article>
        </div>
      </div>
    </section>
  );
}
