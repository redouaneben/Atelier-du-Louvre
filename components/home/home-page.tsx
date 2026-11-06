"use client";

import { HeroSection } from "@/components/home/hero-section";
import { MaisonHistoire } from "@/components/home/maison-histoire";
import { MenuCarte } from "@/components/home/menu-carte";
import { PracticalBlock } from "@/components/home/practical-block";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader, useRestaurantStatus } from "@/components/home/site-header";
import { ReservationProvider } from "@/components/reservation/reservation-context";

export default function HomePage() {
  return (
    <ReservationProvider>
      <HomeContent />
    </ReservationProvider>
  );
}

function HomeContent() {
  const { mounted, status } = useRestaurantStatus();

  return (
    <main className="bg-[var(--resto-paper)] text-neutral-100">
      {mounted && status.banner ? (
        <div
          role="note"
          className="bg-[var(--resto-brand)] px-4 py-3 text-center text-base font-medium text-neutral-950"
        >
          {status.banner}
        </div>
      ) : null}
      <SiteHeader mounted={mounted} status={status} />
      <HeroSection />
      <MaisonHistoire />
      <MenuCarte />
      <PracticalBlock />
      <SiteFooter />
    </main>
  );
}
