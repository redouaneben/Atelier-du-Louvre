"use client";

import type { ReactNode } from "react";

import { useReservation } from "@/components/reservation/reservation-context";
import type { MealServiceId } from "@/data/hours";
import { cn } from "@/lib/utils";

export function ReserveButton({
  children,
  className,
  service,
}: {
  children: ReactNode;
  className?: string;
  service?: MealServiceId;
}) {
  const { openReservation } = useReservation();

  return (
    <button
      type="button"
      onClick={() => openReservation(service ? { service } : undefined)}
      className={cn(className)}
    >
      {children}
    </button>
  );
}
