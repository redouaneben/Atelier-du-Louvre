import { ALLERGEN, type AllergenInfo } from "@/data/allergens";
import { siteConfig } from "@/config/site";

export type MenuItem = {
  name: string;
  ingredients: string;
  price: number | null;
  /** Remplace le montant : « Sur demande », « + 4 € ». */
  priceLabel?: string;
  /** null : pas un plat, pas de bouton allergènes. */
  allergenInfo: AllergenInfo | null;
  /** Affiche un bouton d'appel sous le texte. */
  call?: boolean;
};

export type MenuBlock = {
  label?: string;
  note?: string;
  items: MenuItem[];
};

export type MenuSection = {
  id: string;
  nav: string;
  title: string;
  intro?: string;
  /** Prix du menu quand les lignes sont des choix ou des inclus. */
  menuPrice?: number;
  /** Quand ce menu est servi : midi, soir, jours. */
  when?: string;
  footnote?: string;
  blocks: MenuBlock[];
};

export function formatPrice(value: number) {
  const isWhole = Number.isInteger(value);
  const amount = isWhole ? String(value) : value.toFixed(2).replace(".", ",");
  return `${amount}\u00A0€`;
}

function line(
  name: string,
  ingredients: string,
  price: number | null,
  priceLabel?: string,
  allergenInfo: AllergenInfo | null = null,
  call = false
): MenuItem {
  return { name, ingredients, price, priceLabel, allergenInfo, call };
}

export const MIDI_FORMULAS: MenuItem[] = [
  line("Menu complet", "Entrée, plat et dessert.", 23.9, undefined, ALLERGEN.daily),
  line("Petit menu", "Entrée et plat, ou plat et dessert.", 20.9, undefined, ALLERGEN.daily),
  line(
    "Menu gourmand du midi",
    "Plat du jour, avec café ou thé très gourmand.",
    23.5,
    undefined,
    ALLERGEN.daily
  ),
  line(
    "Menu très gourmand",
    "Entrée, plat du jour, café ou thé très gourmand.",
    27.9,
    undefined,
    ALLERGEN.daily
  ),
];

const SERVICE_NOTE = "Taxes et service compris.";

/** Carte extraite de la carte papier de L'Atelier du Louvre. */
export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "midi",
    nav: "Midi",
    title: "Formules du midi",
    when: "Lundi midi · jeudi midi · vendredi midi · 12 h – 13 h 30",
    intro:
      "Ces formules ne sont pas servies le soir, ni le mardi ou le mercredi.",
    footnote: SERVICE_NOTE,
    blocks: [
      { label: "Formules", items: MIDI_FORMULAS },
      {
        label: "À la carte",
        items: [
          line("Entrée du jour", "", 11, undefined, ALLERGEN.daily),
          line("Plat du jour", "", 15.5, undefined, ALLERGEN.daily),
          line("Dessert du jour", "", 7, undefined, ALLERGEN.daily),
          line("Café ou thé très gourmand", "", 10.5, undefined, ALLERGEN.cafe),
          line("Faisselle", "", 4.5, undefined, ALLERGEN.faisselle),
          line("Assiette de fromages secs", "", 8, undefined, ALLERGEN.fromages),
        ],
      },
    ],
  },
  {
    id: "gourmand",
    nav: "Soir & week-end",
    title: "Menu du soir et du week-end",
    menuPrice: 40.9,
    when: "Vendredi soir · samedi midi et soir · dimanche midi",
    intro:
      "Un seul menu à 40,90 €. Les prix à côté des plats sont ceux de la carte, si vous ne prenez pas le menu.",
    footnote: SERVICE_NOTE,
    blocks: [
      {
        label: "Entrées au choix",
        items: [
          line(
            "Velouté de butternut",
            "Cromesqui de chèvre frais, miel, Granny Smith et noisettes.",
            14.9,
            undefined,
            ALLERGEN.butternut
          ),
          line(
            "Cassolette gourmande aux écrevisses",
            "Ravioles du Dauphiné, poireaux et bisque de crustacés safranée.",
            17.9,
            undefined,
            ALLERGEN.ecrevisses
          ),
          line(
            "Saucisson lyonnais façon meurette",
            "Œuf poché, garniture bourguignonne.",
            15.9,
            undefined,
            ALLERGEN.saucisson
          ),
        ],
      },
      {
        label: "Plats au choix",
        items: [
          line(
            "Paleron de cochon confit",
            "Mousseline de chou-fleur, grenailles rôties, sauce morilles.",
            25.9,
            undefined,
            ALLERGEN.paleron
          ),
          line(
            "Ravioles du Dauphiné",
            "Gratinées, crème et St-Marcellin.",
            19.9,
            undefined,
            ALLERGEN.ravioles
          ),
          line(
            "Plat veggie du moment",
            "Composition du jour, à demander en salle.",
            19.9,
            undefined,
            ALLERGEN.veggie
          ),
          line(
            "Dos de saumon snacké",
            "Risotto aux shiitakes, pak choï, bouillon miso et condiments thaï.",
            25.9,
            undefined,
            ALLERGEN.saumon
          ),
        ],
      },
      {
        label: "Fromage ou dessert",
        note: "Inclus dans le menu, au choix sur l'ardoise.",
        items: [
          line("Fromage ou dessert à l'ardoise", "Au choix.", null, "Inclus", ALLERGEN.ardoiseDessert),
          line("Coupe Limoncello ou After Eight", "Supplément.", null, "+ 4 €", ALLERGEN.coupe),
          line("Baba signature", "Supplément.", null, "+ 4 €", ALLERGEN.baba),
        ],
      },
    ],
  },
  {
    id: "bambins",
    nav: "Bambins",
    title: "L'Atelier des bambins",
    menuPrice: 13,
    intro: "Jusqu'à 12 ans. Plat, boisson et dessert.",
    footnote: SERVICE_NOTE,
    blocks: [
      {
        label: "Plat au choix",
        items: [
          line(
            "Steak haché Black Angus",
            "Frites maison, cuit à point.",
            null,
            undefined,
            ALLERGEN.steak
          ),
          line("Nuggets", "Frites maison.", null, undefined, ALLERGEN.nuggets),
          line(
            "Ravioles du Dauphiné",
            "Gratinées, crème et emmental.",
            null,
            undefined,
            ALLERGEN.raviolesBambin
          ),
        ],
      },
      {
        label: "Boisson",
        items: [
          line(
            "Sirop ou diabolo",
            "Toute autre boisson est facturée en plus.",
            null,
            undefined,
            ALLERGEN.sirop
          ),
        ],
      },
      {
        label: "Dessert",
        items: [
          line(
            "1 boule de glace ou faisselle fermière",
            "",
            null,
            undefined,
            ALLERGEN.glace
          ),
        ],
      },
    ],
  },
  {
    id: "groupes",
    nav: "Groupes",
    title: "Groupes et conditions",
    intro: `${siteConfig.reservation.groups} Deux menus et deux formules boissons sont disponibles.`,
    footnote: SERVICE_NOTE,
    blocks: [
      {
        items: [
          line(
            "Menus de groupes",
            "À demander par téléphone.",
            null,
            "Sur demande",
            null,
            true
          ),
          line(
            "Droit de bouchon",
            "Par bouteille de Champagne de 75 cl.",
            8
          ),
          line(
            "Arrhes",
            `30 % pour valider la réservation. ${siteConfig.reservation.contactName} répond au ${siteConfig.phone.display} ou à ${siteConfig.email}.`,
            null,
            "30 %"
          ),
        ],
      },
    ],
  },
];
