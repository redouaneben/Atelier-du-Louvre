import {
  findActiveSpecialPeriod,
  type SpecialPeriod,
} from "@/data/special-hours";

export type DaySlot = { start: number; end: number };

/** Minutes depuis minuit, fuseau Europe/Paris. 0 = dimanche. */
const LUNCH = { start: 12 * 60, end: 13 * 60 + 30 };
const DINNER = { start: 19 * 60 + 30, end: 21 * 60 + 30 };

export const WEEK_SLOTS: Record<number, DaySlot[]> = {
  0: [LUNCH],
  1: [LUNCH],
  2: [],
  3: [],
  4: [LUNCH],
  5: [LUNCH, DINNER],
  6: [LUNCH, DINNER],
};

const WEEKLY_CLOSED_REASON: Partial<Record<number, string>> = {
  2: "Fermeture hebdomadaire",
  3: "Fermeture hebdomadaire",
};

export function getParisDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" })
  );
}

function minutesFromMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} h${m === 0 ? "" : ` ${m.toString().padStart(2, "0")}`}`;
}

export type OpenStatus = {
  isOpen: boolean;
  subline: string;
  headline?: string;
  banner?: string;
  source: "normal" | "special";
};

function getNormalOpenStatus(now: Date): Omit<OpenStatus, "source"> {
  const day = now.getDay();
  const nowMinutes = minutesFromMidnight(now);
  const slots = WEEK_SLOTS[day] ?? [];

  for (const slot of slots) {
    if (nowMinutes >= slot.start && nowMinutes < slot.end) {
      return {
        isOpen: true,
        subline: `Jusqu'à ${formatMinutes(slot.end)}`,
      };
    }
  }

  for (const slot of slots) {
    if (nowMinutes < slot.start) {
      return {
        isOpen: false,
        subline: `Ouvre à ${formatMinutes(slot.start)}`,
      };
    }
  }

  const next = findNextOpening(now);
  return {
    isOpen: false,
    subline: next ?? "Hors horaires d'ouverture",
  };
}

function statusFromSpecialClosed(special: SpecialPeriod): OpenStatus {
  return {
    isOpen: false,
    subline: special.badgeLine,
    headline: special.headline ?? "Congés",
    banner: special.banner,
    source: "special",
  };
}

function getOpenStatusWithOverrideSlots(
  now: Date,
  slots: DaySlot[],
  special: SpecialPeriod
): OpenStatus {
  const nowMinutes = minutesFromMidnight(now);

  for (const slot of slots) {
    if (nowMinutes >= slot.start && nowMinutes < slot.end) {
      return {
        isOpen: true,
        subline: special.badgeLine || `Jusqu'à ${formatMinutes(slot.end)}`,
        headline: special.headline,
        banner: special.banner,
        source: "special",
      };
    }
  }

  for (const slot of slots) {
    if (nowMinutes < slot.start) {
      return {
        isOpen: false,
        subline: special.badgeLine || `Ouvre à ${formatMinutes(slot.start)}`,
        headline: special.headline,
        banner: special.banner,
        source: "special",
      };
    }
  }

  return {
    isOpen: false,
    subline: special.badgeLine || "Hors horaires ce jour",
    headline: special.headline,
    banner: special.banner,
    source: "special",
  };
}

export function getOpenStatus(now: Date): OpenStatus {
  const special = findActiveSpecialPeriod(now);

  if (special) {
    if (special.kind === "closed" || special.forceClosed) {
      return statusFromSpecialClosed(special);
    }

    if (special.kind === "hours_override" && special.daySlots?.length) {
      return getOpenStatusWithOverrideSlots(now, special.daySlots, special);
    }

    if (special.kind === "info") {
      const normal = getNormalOpenStatus(now);
      return {
        ...normal,
        subline: special.badgeLine || normal.subline,
        headline: special.headline,
        banner: special.banner,
        source: "special",
      };
    }
  }

  return { ...getNormalOpenStatus(now), source: "normal" };
}

const DAY_LABELS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
] as const;

function findNextOpening(from: Date): string | null {
  const startDay = from.getDay();

  for (let offset = 1; offset <= 7; offset++) {
    const day = (startDay + offset) % 7;
    const slots = WEEK_SLOTS[day] ?? [];
    if (slots.length === 0) continue;
    const first = slots[0]!;
    const dayLabel =
      offset === 1 ? "demain" : `${DAY_LABELS[day]!.slice(0, 3)}.`;
    return `Ouvre ${dayLabel} à ${formatMinutes(first.start)}`;
  }
  return null;
}

/** Horaires détaillés, lundi → dimanche. `weekday` suit Date#getDay. */
export const WEEK_SCHEDULE: {
  weekday: number;
  day: string;
  detail: string;
  closed?: boolean;
}[] = [
  { weekday: 1, day: "Lundi", detail: "12 h – 13 h 30" },
  {
    weekday: 2,
    day: "Mardi",
    detail: "Fermé — fermeture hebdomadaire",
    closed: true,
  },
  {
    weekday: 3,
    day: "Mercredi",
    detail: "Fermé — fermeture hebdomadaire",
    closed: true,
  },
  { weekday: 4, day: "Jeudi", detail: "12 h – 13 h 30" },
  { weekday: 5, day: "Vendredi", detail: "12 h – 13 h 30 · 19 h 30 – 21 h 30" },
  { weekday: 6, day: "Samedi", detail: "12 h – 13 h 30 · 19 h 30 – 21 h 30" },
  { weekday: 0, day: "Dimanche", detail: "12 h – 13 h 30" },
];

/** Compatibilité d'affichage simple */
export const HOURS_DISPLAY: { text: string; muted?: boolean }[] =
  WEEK_SCHEDULE.map((row) => ({
    text: `${row.day} — ${row.detail}`,
    muted: row.closed,
  }));

export type MealServiceId = "midi" | "soir";

export type MealService = {
  id: MealServiceId;
  label: string;
  hint: string;
  ended: boolean;
};

export function getParisDateKey(date: Date = getParisDate()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Midi local, sans décalage UTC au passage minuit. */
export function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);
}

function servicesFromSlots(
  slots: DaySlot[],
  date: Date,
  now: Date
): MealService[] {
  const lunch = slots.find((slot) => slot.start < 16 * 60);
  const dinner = slots.find((slot) => slot.start >= 16 * 60);
  const sameDay = getParisDateKey(date) === getParisDateKey(now);
  const nowMinutes = minutesFromMidnight(now);

  const toService = (
    id: MealServiceId,
    label: string,
    slot: DaySlot
  ): MealService => ({
    id,
    label,
    hint: `${formatMinutes(slot.start)} – ${formatMinutes(slot.end)}`,
    ended: sameDay && nowMinutes >= slot.end,
  });

  const services: MealService[] = [];
  if (lunch) services.push(toService("midi", "Midi", lunch));
  if (dinner) services.push(toService("soir", "Soir", dinner));
  return services;
}

export function getBookingDay(date: Date, now: Date = getParisDate()) {
  const special = findActiveSpecialPeriod(date);

  if (special && (special.kind === "closed" || special.forceClosed)) {
    return {
      closed: true,
      reason: special.badgeLine || "Fermé",
      services: [] as MealService[],
    };
  }

  const slots =
    special?.kind === "hours_override" && special.daySlots?.length
      ? special.daySlots
      : (WEEK_SLOTS[date.getDay()] ?? []);

  const services = servicesFromSlots(slots, date, now);
  if (services.length === 0) {
    return {
      closed: true,
      reason: WEEKLY_CLOSED_REASON[date.getDay()] ?? "Fermé ce jour",
      services,
    };
  }

  return { closed: false, reason: "", services };
}
