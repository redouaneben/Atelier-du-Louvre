import { parseDateInput, type MealServiceId } from "@/data/hours";
import { MENU_SECTIONS } from "@/data/menu";

export type OrderKind = "formula" | "carte" | "supplement" | "bambin";

export type OrderItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  kind: OrderKind;
  group: string;
};

export type OrderGroup = {
  label: string;
  items: OrderItem[];
};

export type OrderOffer = {
  formulas: OrderItem[];
  carte: OrderGroup[];
  supplements: OrderItem[];
  bambins: OrderItem[];
  items: OrderItem[];
};

const EMPTY_OFFER: OrderOffer = {
  formulas: [],
  carte: [],
  supplements: [],
  bambins: [],
  items: [],
};

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function item(
  id: string,
  name: string,
  detail: string,
  price: number,
  kind: OrderKind,
  group: string
): OrderItem {
  return { id, name, detail, price, kind, group };
}

const MIDI_CARTE_GROUP: Record<string, string> = {
  "Entrée du jour": "Entrée",
  "Plat du jour": "Plat",
  "Dessert du jour": "Desserts",
  Faisselle: "Desserts",
  "Assiette de fromages secs": "Desserts",
  "Café ou thé très gourmand": "Café ou thé",
};

function midiOffer(): Pick<OrderOffer, "formulas" | "carte"> {
  const section = MENU_SECTIONS.find((entry) => entry.id === "midi");
  const formulas = (section?.blocks.find((block) => block.label === "Formules")?.items ?? []).flatMap(
    (dish) =>
      dish.price == null
        ? []
        : [
            item(
              slug(`midi-${dish.name}`),
              dish.name,
              dish.ingredients,
              dish.price,
              "formula",
              "Formules"
            ),
          ]
  );

  const byGroup = new Map<string, OrderItem[]>();
  for (const dish of section?.blocks.find((block) => block.label === "À la carte")?.items ?? []) {
    if (dish.price == null) continue;
    const group = MIDI_CARTE_GROUP[dish.name] ?? "À la carte";
    const list = byGroup.get(group) ?? [];
    list.push(item(slug(`midi-${dish.name}`), dish.name, dish.ingredients, dish.price, "carte", group));
    byGroup.set(group, list);
  }

  return {
    formulas,
    carte: [...byGroup.entries()].map(([label, items]) => ({ label, items })),
  };
}

function gourmandOffer(): Pick<OrderOffer, "formulas" | "carte" | "supplements"> {
  const section = MENU_SECTIONS.find((entry) => entry.id === "gourmand");
  const formulas =
    section?.menuPrice == null
      ? []
      : [
          item(
            "menu-soir",
            "Menu du soir et du week-end",
            "Entrée, plat, fromage ou dessert à l'ardoise.",
            section.menuPrice,
            "formula",
            "Formules"
          ),
        ];

  const carte: OrderGroup[] = [];
  const supplements: OrderItem[] = [];
  for (const block of section?.blocks ?? []) {
    const dishes = block.items.flatMap((dish) => {
      if (dish.priceLabel === "+ 4 €") {
        supplements.push(
          item(slug(`gourmand-${dish.name}`), dish.name, "En plus de la formule.", 4, "supplement", "Suppléments")
        );
        return [];
      }
      if (dish.price == null) return [];
      return [
        item(
          slug(`gourmand-${dish.name}`),
          dish.name,
          dish.ingredients,
          dish.price,
          "carte",
          block.label ?? "À la carte"
        ),
      ];
    });
    if (dishes.length > 0 && block.label) carte.push({ label: block.label.replace(" au choix", ""), items: dishes });
  }

  return { formulas, carte, supplements };
}

function bambinItems(): OrderItem[] {
  const section = MENU_SECTIONS.find((entry) => entry.id === "bambins");
  const price = section?.menuPrice;
  const plats = section?.blocks.find((block) => block.label === "Plat au choix");
  if (price == null || !plats) return [];
  return plats.items.map((dish) =>
    item(
      slug(`bambin-${dish.name}`),
      dish.name,
      `${dish.ingredients} Jusqu'à 12 ans, avec boisson et dessert.`.trim(),
      price,
      "bambin",
      "Bambins"
    )
  );
}

function offerFrom(parts: {
  formulas?: OrderItem[];
  carte?: OrderGroup[];
  supplements?: OrderItem[];
  bambins?: OrderItem[];
}): OrderOffer {
  const formulas = parts.formulas ?? [];
  const carte = parts.carte ?? [];
  const supplements = parts.supplements ?? [];
  const bambins = parts.bambins ?? [];
  return {
    formulas,
    carte,
    supplements,
    bambins,
    items: [...formulas, ...carte.flatMap((group) => group.items), ...supplements, ...bambins],
  };
}

/** Plats commandables pour une date et un service. Les groupes restent sur demande. */
export function orderCatalog(date: Date, service: MealServiceId): OrderOffer {
  const day = date.getDay();
  const midiWeekday = service === "midi" && (day === 1 || day === 4 || day === 5);
  const gourmand =
    (service === "midi" && (day === 0 || day === 6)) ||
    (service === "soir" && (day === 5 || day === 6));

  if (!midiWeekday && !gourmand) return EMPTY_OFFER;

  const source = gourmand ? gourmandOffer() : midiOffer();
  return offerFrom({ ...source, bambins: bambinItems() });
}

export function orderCatalogFor(date: string, service: MealServiceId) {
  return orderCatalog(parseDateInput(date), service);
}
