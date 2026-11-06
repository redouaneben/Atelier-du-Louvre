/**
 * Design system — restaurant traditionnel, luxe sobre.
 * Couleurs injectées en variables `--resto-*` dans `app/layout.tsx`.
 */
export const theme = {
  colors: {
    paper: "#000000",
    brand: "#d6b17a",
    brandDark: "#b08a4f",
    brandSoft: "#ead7b2",
    accent: "#8fbf9f",
    ink: "#f5f5f4",
    surface: "#1e1e20",
    statusClosed: "#262626",
    heroOverlay: "#000000",
  },
  decorBrandFilter:
    "brightness(0) saturate(100%) invert(83%) sepia(22%) saturate(620%) hue-rotate(355deg) brightness(92%) contrast(88%)",
  fonts: {
    script: "Cormorant Garamond",
    sans: "Outfit",
  },
} as const;
