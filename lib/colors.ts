import { theme } from "@/config/theme";

/** Alias legacy — préférer les classes `var(--resto-*)` dans les composants */
export const C = {
  paper: theme.colors.paper,
  forest: theme.colors.brand,
  forestDark: theme.colors.brandDark,
  sage: theme.colors.accent,
  ink: theme.colors.ink,
  white: theme.colors.surface,
} as const;

export const DECOR_FOREST_DARK_FILTER = theme.decorBrandFilter;
