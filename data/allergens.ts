import { siteConfig } from "@/config/site";

/** La carte papier ne fournit pas de tableau allergènes. On ne liste que ce qui est écrit. */
export const ALLERGEN_DISCLAIMER = `Les allergènes sont communiqués en salle. En cas d'allergie sévère, appelez le ${siteConfig.phone.display} avant de réserver.`;

export type DishAllergen = {
  label: string;
  detail: string;
};

export type AllergenInfo = {
  items: DishAllergen[];
  note: string;
};

const CAVEAT =
  "Relevé d'après les ingrédients écrits à la carte. Ce n'est pas un audit de cuisine.";

export const ALLERGEN = {
  daily: {
    items: [],
    note: "Le plat change. Il est affiché au restaurant.",
  },
  ask: {
    items: [],
    note: "La composition n'est pas détaillée sur la carte. Demandez en salle avant de commander.",
  },
  butternut: {
    items: [
      { label: "Lait", detail: "Cromesqui de chèvre frais." },
      { label: "Fruits à coque", detail: "Noisettes." },
    ],
    note: CAVEAT,
  },
  ecrevisses: {
    items: [
      { label: "Crustacés", detail: "Écrevisses et bisque de crustacés." },
      { label: "Gluten", detail: "Ravioles du Dauphiné." },
      { label: "Œufs", detail: "Ravioles du Dauphiné." },
      { label: "Lait", detail: "Ravioles du Dauphiné." },
    ],
    note: CAVEAT,
  },
  saucisson: {
    items: [{ label: "Œufs", detail: "Œuf poché." }],
    note: "La garniture bourguignonne n'est pas détaillée. Demandez en salle.",
  },
  paleron: {
    items: [],
    note: "Aucun allergène majeur n'est nommé (cochon, chou-fleur, pommes de terre, morilles). La sauce peut en contenir. Demandez en salle.",
  },
  ravioles: {
    items: [
      { label: "Gluten", detail: "Ravioles du Dauphiné." },
      { label: "Œufs", detail: "Ravioles du Dauphiné." },
      { label: "Lait", detail: "Crème et St-Marcellin." },
    ],
    note: CAVEAT,
  },
  veggie: {
    items: [],
    note: "Composition du jour, à demander en salle.",
  },
  saumon: {
    items: [
      { label: "Poisson", detail: "Dos de saumon." },
      { label: "Soja", detail: "Bouillon miso." },
    ],
    note: "Les condiments thaï ne sont pas détaillés sur la carte.",
  },
  ardoiseDessert: {
    items: [{ label: "Lait", detail: "Si vous prenez le fromage." }],
    note: "Le dessert à l'ardoise change. Demandez en salle.",
  },
  faisselle: {
    items: [{ label: "Lait", detail: "Faisselle." }],
    note: CAVEAT,
  },
  fromages: {
    items: [{ label: "Lait", detail: "Fromages secs." }],
    note: CAVEAT,
  },
  cafe: {
    items: [],
    note: "Le café ou le thé très gourmand n'est pas détaillé sur la carte.",
  },
  steak: {
    items: [],
    note: "Bœuf et frites maison. Aucun allergène majeur n'est nommé. Confirmez la friture en salle.",
  },
  nuggets: {
    items: [{ label: "Gluten", detail: "Panure habituelle des nuggets — à confirmer en salle." }],
    note: "La panure exacte n'est pas écrite sur la carte.",
  },
  raviolesBambin: {
    items: [
      { label: "Gluten", detail: "Ravioles du Dauphiné." },
      { label: "Œufs", detail: "Ravioles du Dauphiné." },
      { label: "Lait", detail: "Crème et emmental." },
    ],
    note: CAVEAT,
  },
  sirop: {
    items: [],
    note: "Aucun allergène majeur n'est nommé pour un sirop ou un diabolo. Le parfum est à confirmer.",
  },
  glace: {
    items: [{ label: "Lait", detail: "Faisselle, ou glace à la crème selon le parfum." }],
    note: "Le parfum de glace du jour peut être un sorbet. Demandez en salle.",
  },
} as const satisfies Record<string, AllergenInfo>;
