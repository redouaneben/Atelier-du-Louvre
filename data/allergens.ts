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
  "Relevé d'après les ingrédients écrits à la carte. Une liaison ou une friture non indiquée peut en ajouter.";

export const ALLERGEN = {
  daily: {
    items: [],
    note: "La composition change à chaque service. Les allergènes du jour sont affichés au restaurant et sur Facebook.",
  },
  butternut: {
    items: [
      { label: "Lait", detail: "Chèvre du cromesqui." },
      { label: "Fruits à coque", detail: "Noisettes." },
      { label: "Gluten", detail: "Panure du cromesqui." },
    ],
    note: "Miel et pomme Granny Smith : pas d'allergène majeur. La carte ne dit pas si la panure contient de l'œuf.",
  },
  ecrevisses: {
    items: [
      { label: "Crustacés", detail: "Écrevisses et bisque de crustacés." },
      { label: "Gluten", detail: "Pâte de blé des ravioles du Dauphiné." },
      { label: "Œufs", detail: "Œufs de la pâte des ravioles." },
      { label: "Lait", detail: "Comté et crème des ravioles du Dauphiné." },
    ],
    note: "Poireaux et safran : pas d'allergène majeur. La bisque n'est pas détaillée au-delà des crustacés.",
  },
  saucisson: {
    items: [
      { label: "Œufs", detail: "Œuf poché." },
      { label: "Sulfites", detail: "Vin rouge de la sauce meurette." },
    ],
    note: "La garniture bourguignonne n'est pas détaillée. Si la sauce est liée à la farine, elle contient du gluten.",
  },
  paleron: {
    items: [
      {
        label: "Lait",
        detail: "Mousseline de chou-fleur et sauce aux morilles, préparations montées à la crème ou au beurre.",
      },
    ],
    note: "Cochon, grenailles et morilles : pas d'allergène majeur en eux-mêmes. La carte ne dit pas si la sauce est liée à la farine (gluten).",
  },
  ravioles: {
    items: [
      { label: "Gluten", detail: "Pâte de blé des ravioles." },
      { label: "Œufs", detail: "Œufs de la pâte." },
      { label: "Lait", detail: "Comté et crème des ravioles, puis crème et Saint-Marcellin du gratin." },
    ],
    note: CAVEAT,
  },
  veggie: {
    items: [],
    note: "Aucun ingrédient n'est écrit : c'est le plat du moment. Demandez la composition avant de commander.",
  },
  saumon: {
    items: [
      { label: "Poisson", detail: "Dos de saumon." },
      { label: "Soja", detail: "Bouillon miso." },
    ],
    note: "Shiitakes et pak choï : pas d'allergène majeur. Les condiments thaï ne sont pas détaillés : sésame possible, arachide plus rare. Un miso d'orge apporterait du gluten.",
  },
  ardoiseDessert: {
    items: [{ label: "Lait", detail: "Fromage, si vous le choisissez à la place du dessert." }],
    note: "Le dessert à l'ardoise change. Il peut contenir gluten, œufs, lait, fruits à coque ou soja. Demandez celui du jour.",
  },
  coupe: {
    items: [
      { label: "Lait", detail: "Glace de la coupe. Chocolat au lait, si vous prenez l'After Eight." },
      { label: "Œufs", detail: "Glace prise sur une crème anglaise, base habituelle d'une coupe." },
      { label: "Sulfites", detail: "Limoncello, si vous choisissez ce parfum." },
      { label: "Soja", detail: "Lécithine du chocolat After Eight, si vous choisissez ce parfum." },
    ],
    note: "Deux parfums au choix. La recette maison de la coupe n'est pas écrite.",
  },
  baba: {
    items: [
      { label: "Gluten", detail: "Brioche du baba." },
      { label: "Œufs", detail: "Brioche." },
      { label: "Lait", detail: "Beurre de la brioche. Crème fouettée, si elle est servie avec." },
      { label: "Sulfites", detail: "Alcool de trempage, en principe du rhum." },
    ],
    note: "La garniture signature n'est pas détaillée sur la carte.",
  },
  faisselle: {
    items: [{ label: "Lait", detail: "Faisselle, fromage frais." }],
    note: "Aucun autre allergène n'est écrit pour cette ligne.",
  },
  fromages: {
    items: [{ label: "Lait", detail: "Fromages secs." }],
    note: "Aucun autre allergène n'est écrit. La sélection du jour est en salle.",
  },
  cafe: {
    items: [],
    note: "La carte ne détaille pas le café ou le thé très gourmand. L'accompagnement peut contenir du lait, et une mignardise (gluten, œuf, fruits à coque).",
  },
  steak: {
    items: [
      {
        label: "Gluten",
        detail: "Pas dans le steak. Traces possibles : les frites peuvent cuire dans la même huile que les nuggets panés.",
      },
    ],
    note: "Bœuf et pommes de terre : pas d'allergène majeur. Confirmez la friture en salle.",
  },
  nuggets: {
    items: [
      { label: "Gluten", detail: "Panure de blé." },
      { label: "Œufs", detail: "Œuf de la panure, pratique habituelle. La recette n'est pas écrite." },
    ],
    note: "Les frites maison sont des pommes de terre.",
  },
  raviolesBambin: {
    items: [
      { label: "Gluten", detail: "Pâte de blé des ravioles." },
      { label: "Œufs", detail: "Œufs de la pâte." },
      { label: "Lait", detail: "Ravioles, crème et emmental du gratin." },
    ],
    note: CAVEAT,
  },
  sirop: {
    items: [
      {
        label: "Fruits à coque",
        detail: "Uniquement si le sirop est à l'orgeat (amande). Grenadine, menthe ou citron : pas d'allergène majeur.",
      },
    ],
    note: "Le parfum servi n'est pas écrit. À confirmer en salle.",
  },
  glace: {
    items: [
      { label: "Lait", detail: "Faisselle fermière. Glace à la crème, si ce n'est pas un sorbet." },
      { label: "Œufs", detail: "Glace à la crème anglaise, selon le parfum. Absent d'un sorbet de fruit." },
    ],
    note: "Le parfum du jour n'est pas écrit. Un sorbet fruit, sucre et eau n'a en principe ni lait ni œuf.",
  },
} as const satisfies Record<string, AllergenInfo>;
