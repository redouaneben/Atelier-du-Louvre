"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";

import { display } from "@/lib/fonts";
import { PAGE_SHELL } from "@/lib/page-shell";
import { cn } from "@/lib/utils";
import terrasse from "../../IMGS/ext.webp";
import salleFenetres from "../../IMGS/inter1.webp";
import salleClaire from "../../IMGS/inter2.webp";
import salleOr from "../../IMGS/inter7.webp";
import salleRayee from "../../IMGS/inter8.jpg";

const ATOUTS = [
  { title: "Deux salles", text: "Des espaces pensés pour vous accueillir." },
  { title: "Une grande terrasse", text: "Profitez des beaux jours à l'extérieur." },
  { title: "À emporter", text: "Retrouvez nos saveurs où vous voulez." },
  { title: "L'art de recevoir", text: "Un accueil chaleureux, tout simplement." },
] as const;

const SLIDES: { src: StaticImageData; alt: string }[] = [
  { src: salleOr, alt: "Salle du restaurant, table dressée sous un plafond doré" },
  { src: salleRayee, alt: "Salle aux murs rayés, suspensions en rotin et plantes suspendues" },
  { src: salleClaire, alt: "Salle claire, grande table ronde et mur végétal" },
  { src: salleFenetres, alt: "Salle côté fenêtres, grande table ronde et mur végétal" },
  { src: terrasse, alt: "Grande terrasse du restaurant, tables sous les parasols" },
];

const SLIDE_MS = 5500;

export function MaisonHistoire() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="histoire" className="scroll-mt-20 py-14 sm:scroll-mt-24 sm:py-20">
      <div className={PAGE_SHELL}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24 xl:gap-32">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--resto-brand)]">
              L&apos;esprit de la maison
            </p>
            <span className="mt-4 block h-px w-10 bg-[var(--resto-brand)]" aria-hidden />
            <h2
              className={cn(
                display.className,
                "mt-3 text-4xl font-medium tracking-tight text-neutral-100 sm:text-5xl"
              )}
            >
              Une cuisine de saveurs au rythme des saisons
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-neutral-300 sm:text-lg">
              <p>
                <span className="font-semibold text-white">Antoine et Cécile</span> se
                rencontrent <span className="font-semibold text-white">en 2004</span>, à
                Vienne, et décident d&apos;ouvrir leur restaurant.
              </p>
              <p>
                En 2006, ils reprennent A La Guill&apos;on Dîne à Lyon, le restaurant
                de Martine, la maman d&apos;Antoine. Ils y restent{" "}
                <span className="font-semibold text-white">pendant huit années</span>.
              </p>
              <p>
                Direction Saint-Symphorien-d&apos;Ozon : «{" "}
                <span className="font-semibold text-white">Le Petit Louvre</span> » devient
                « <span className="font-semibold text-white">L&apos;Atelier du Louvre</span> ».{" "}
                <span className="font-semibold text-white">Vingt ans d&apos;expérience</span>,
                et la cuisine se fait toujours ici.
              </p>
              <p>
                Les plats de la région sont revisités, sans perdre leur goût.
                Authentique, et actuel.
              </p>
            </div>
          </div>
          <div>
            <div
              className="relative overflow-hidden rounded-2xl border border-neutral-800"
              aria-roledescription="carrousel"
              aria-label="Salles et terrasse"
            >
              {SLIDES.map((slide, slideIndex) => (
                <Image
                  key={slide.alt}
                  src={slide.src}
                  alt={slide.alt}
                  className={cn(
                    "aspect-[4/3] w-full object-cover transition-opacity duration-700",
                    slideIndex === index ? "relative opacity-100" : "absolute inset-0 opacity-0"
                  )}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  aria-hidden={slideIndex !== index}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-1.5" role="group" aria-label="Choisir une photo">
              {SLIDES.map((slide, slideIndex) => {
                const active = slideIndex === index;
                return (
                  <button
                    key={slide.alt}
                    type="button"
                    aria-label={`Photo ${slideIndex + 1} sur ${SLIDES.length}`}
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
        </div>
        <p className="mx-auto mt-20 w-full text-center font-medium leading-none whitespace-nowrap text-neutral-100 sm:mt-28 [font-size:clamp(0.85rem,2.4vw,2.6rem)]">
          «&nbsp;Tout se prépare ici, pour le plaisir de la table.&nbsp;»
        </p>
        <ul className="mt-16 flex flex-nowrap items-start justify-between gap-x-6 sm:mt-24 sm:gap-x-12 lg:gap-x-16 xl:gap-x-24">
          {ATOUTS.map((item) => (
            <li key={item.title} className="flex min-w-0 flex-1 flex-col items-center px-1 text-center sm:px-3">
              <p className="font-medium leading-tight text-neutral-100 [font-size:clamp(0.8rem,1.5vw,1.5rem)]">
                {item.title}
              </p>
              <span className="mt-3 block h-px w-10 shrink-0 bg-[var(--resto-brand)]" aria-hidden />
              <p className="mt-3 max-w-[16rem] leading-snug text-neutral-400 [font-size:clamp(0.68rem,1.05vw,1rem)]">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
