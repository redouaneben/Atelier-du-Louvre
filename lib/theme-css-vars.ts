import type { CSSProperties } from "react";

import { theme } from "@/config/theme";

export function themeCssVariables(): CSSProperties {
  const c = theme.colors;
  return {
    "--resto-paper": c.paper,
    "--resto-brand": c.brand,
    "--resto-brand-dark": c.brandDark,
    "--resto-brand-soft": c.brandSoft,
    "--resto-accent": c.accent,
    "--resto-ink": c.ink,
    "--resto-surface": c.surface,
    "--resto-status-closed": c.statusClosed,
    "--resto-hero-overlay": c.heroOverlay,
    "--resto-decor-filter": theme.decorBrandFilter,
  } as CSSProperties;
}
