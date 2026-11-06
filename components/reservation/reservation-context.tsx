"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { ReservationSheet } from "@/components/reservation/reservation-sheet";
import type { MealServiceId } from "@/data/hours";

type ReservationPreset = {
  service?: MealServiceId;
};

type ReservationContextValue = {
  openReservation: (preset?: ReservationPreset) => void;
  closeReservation: () => void;
};

const ReservationContext = createContext<ReservationContextValue | null>(null);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<ReservationPreset | null>(null);

  const value = useMemo<ReservationContextValue>(
    () => ({
      openReservation: (next) => {
        setPreset(next ?? null);
        setOpen(true);
      },
      closeReservation: () => setOpen(false),
    }),
    []
  );

  return (
    <ReservationContext.Provider value={value}>
      {children}
      <ReservationSheet
        open={open}
        preset={preset}
        onClose={() => setOpen(false)}
      />
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation doit être utilisé dans ReservationProvider");
  }
  return context;
}
