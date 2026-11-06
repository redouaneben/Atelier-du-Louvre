"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Phone } from "lucide-react";
import { motion } from "motion/react";

import { ReserveButton } from "@/components/reservation/reserve-button";
import { HERO_SLIDES } from "@/config/hero-slides";
import { siteConfig } from "@/config/site";
import { display } from "@/lib/fonts";
import { PAGE_SHELL } from "@/lib/page-shell";
import { restoButtonClass } from "@/lib/resto-button";
import { cn } from "@/lib/utils";

const SLIDE_MS = 5500;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused, index]);

  return (
    <section
      id="accueil"
      aria-roledescription="carrousel"
      aria-label="Photos du restaurant"
      className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-end sm:min-h-[calc(100svh-6rem)]"
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {HERO_SLIDES.map((slide, slideIndex) => (
        <Image
          key={slide.alt}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={slideIndex === 0}
          sizes="100vw"
          aria-hidden={slideIndex !== index}
          className={cn(
            "object-cover object-center transition-opacity duration-700",
            slideIndex === index ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-0 bg-neutral-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/20" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={cn(PAGE_SHELL, "relative z-10 pb-8 pt-16 sm:pb-12")}
      >
        <div className="max-w-xl rounded-2xl border border-zinc-800 bg-[var(--resto-surface)] p-5 transition-colors duration-200 hover:border-zinc-600 sm:p-7">
          <span className="mb-4 block h-px w-10 bg-[var(--resto-brand)]" />
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--resto-brand)]">
            {siteConfig.tagline}
          </p>
          <h1
            className={cn(
              display.className,
              "mt-3 text-[2.6rem] font-medium leading-[0.95] tracking-tight text-neutral-100 sm:text-6xl"
            )}
          >
            {siteConfig.name}
          </h1>
          <p className={cn(display.className, "mt-4 text-2xl italic leading-snug text-neutral-200 sm:text-3xl")}>
            {siteConfig.heroTagline}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ReserveButton className={restoButtonClass("primary", "md", "w-full")}>
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              Réserver
            </ReserveButton>
            <a
              href={siteConfig.phone.href}
              aria-label={`Appeler le ${siteConfig.phone.display}`}
              className={restoButtonClass("secondary", "md", "w-full tabular-nums")}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {siteConfig.phone.display}
            </a>
          </div>
          <div className="mt-5 flex gap-1.5" role="group" aria-label="Choisir une photo">
            {HERO_SLIDES.map((slide, slideIndex) => {
              const active = slideIndex === index;
              return (
                <button
                  key={slide.alt}
                  type="button"
                  aria-label={`Photo ${slideIndex + 1} sur ${HERO_SLIDES.length}`}
                  aria-current={active ? "true" : undefined}
                  onClick={() => setIndex(slideIndex)}
                  className="flex h-8 w-8 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      active ? "w-6 bg-[var(--resto-brand)]" : "w-1.5 bg-white/80"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
