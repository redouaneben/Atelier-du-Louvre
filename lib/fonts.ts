import { Cormorant_Garamond, Outfit } from "next/font/google";

import { theme } from "@/config/theme";

/** Titres — nom documenté dans `config/theme.ts` */
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-site",
});

export const sans = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans-site",
});

void theme.fonts;
