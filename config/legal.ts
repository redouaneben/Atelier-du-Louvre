/**
 * Mentions légales — compléter avant mise en facturation / domaine définitif.
 * Blueprint : copier et adapter par client.
 */
export const legalConfig = {
  /** Responsable de publication (gérant ou représentant légal) */
  publisherName: "Antoine Coche",
  publisherRole: "Gérant",
  /** Raison sociale (enseigne : L'Atelier du Louvre) */
  companyName: "ACP",

  /**
   * Contact RGPD / mentions. Tant que la valeur commence par « [ », le site
   * affiche le téléphone de `config/site.ts` à la place.
   */
  contactEmail: "atelierdulouvre@gmail.com",

  /** Identifiants entreprise (France) */
  siret: "491 698 130 00037",
  rcs: "Lyon 2006 B 03871",

  /** Hébergement du site */
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },

  /** Dernière mise à jour des textes */
  lastUpdated: "6 novembre 2026",
} as const;
