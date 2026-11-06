/**
 * Identité réelle — L'Atelier du Louvre, Saint-Symphorien-d'Ozon.
 */
const defaultUrl = "https://www.atelierdulouvre-restaurant.fr";

export const siteConfig = {
  name: "L'Atelier du Louvre",
  legalName: "L'Atelier du Louvre",
  shortName: "L'Atelier",
  headerLine: "du Louvre",
  tagline: "Restaurant",
  heroTagline:
    "Formules du midi et menu gourmand, à Saint-Symphorien-d'Ozon.",
  footerLine: "Saint-Symphorien-d'Ozon",
  locale: "fr_FR" as const,
  language: "fr" as const,

  url: (process.env.NEXT_PUBLIC_SITE_URL ?? defaultUrl).replace(/\/$/, ""),

  phone: {
    display: "04 78 02 80 80",
    href: "tel:+33478028080",
    e164: "+33478028080",
  },

  email: "atelierdulouvre@gmail.com",

  address: {
    streetAddress: "13 Quai Hector Berlioz",
    postalCode: "69360",
    addressLocality: "Saint-Symphorien-d'Ozon",
    addressCountry: "FR",
  },

  /** Laisser `href` vide pour masquer le lien dans le pied de page */
  facebook: {
    href: "https://www.facebook.com/atelierdulouvre",
    label: "Facebook",
  },

  map: {
    embedUrl:
      "https://maps.google.com/maps?q=13+Quai+Hector+Berlioz,+69360+Saint-Symphorien-d%27Ozon&z=16&output=embed",
  },

  reservation: {
    contactName: "Cécile",
    deposit: "30 % d'arrhes pour valider la réservation.",
    corkage: "Droit de bouchon : 8 € par bouteille de Champagne (75 cl).",
    groups: "Menus de groupes disponibles sur demande.",
  },

  seo: {
    title:
      "L'Atelier du Louvre | Restaurant à Saint-Symphorien-d'Ozon",
    description:
      "Restaurant au 13 quai Hector Berlioz à Saint-Symphorien-d'Ozon. Formules du midi, menu gourmand et réservation au 04 78 02 80 80.",
    keywords: [
      "L'Atelier du Louvre",
      "restaurant Saint-Symphorien-d'Ozon",
      "menu du midi",
      "menu gourmand",
      "réservation restaurant",
      "Quai Hector Berlioz",
    ],
    ogDescription:
      "Formules du midi et menu gourmand. 13 quai Hector Berlioz, Saint-Symphorien-d'Ozon.",
    twitterDescription:
      "Restaurant à Saint-Symphorien-d'Ozon. Carte, horaires et réservation au 04 78 02 80 80.",
    ogImageAlt:
      "L'Atelier du Louvre — restaurant à Saint-Symphorien-d'Ozon",
  },

  business: {
    servesCuisine: "Cuisine française",
    priceRange: "€€",
  },
} as const;

export function getAddressLines(): [string, string] {
  const { streetAddress, postalCode, addressLocality } = siteConfig.address;
  return [streetAddress, `${postalCode} ${addressLocality}`];
}

export function getFullAddress(): string {
  const [line1, line2] = getAddressLines();
  return `${line1}, ${line2}`;
}

export function getDirectionLinks() {
  const query = encodeURIComponent(getFullAddress());
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${query}`,
    waze: `https://waze.com/ul?q=${query}&navigate=yes`,
  };
}
