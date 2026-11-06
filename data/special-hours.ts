/**
 * Fermetures exceptionnelles, congés, travaux, horaires ponctuels.
 * Dates incluses, fuseau Europe/Paris (YYYY-MM-DD).
 *
 * Pour désactiver une période : supprimez le bloc ou commentez-le (export vide).
 */
export type SpecialPeriodKind = "closed" | "info" | "hours_override";

export type SpecialPeriod = {
  id: string;
  from: string;
  to: string;
  kind: SpecialPeriodKind;
  /** Sous-ligne du badge (courte) */
  badgeLine: string;
  /** Remplace « Ouvert » / « Fermé » (ex. Congés, Travaux) */
  headline?: string;
  /** Bandeau sous le hero (texte plus long) */
  banner?: string;
  /** Ignore les créneaux habituels — obligatoire pour kind: "closed" */
  forceClosed?: boolean;
  /** kind: "hours_override" — créneaux ce jour-là (minutes depuis minuit) */
  daySlots?: { start: number; end: number }[];
};

export const SPECIAL_PERIODS: SpecialPeriod[] = [];

function parisDateKey(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Europe/Paris" });
}

export function findActiveSpecialPeriod(
  now: Date
): SpecialPeriod | undefined {
  const key = parisDateKey(now);
  return SPECIAL_PERIODS.find((p) => key >= p.from && key <= p.to);
}
