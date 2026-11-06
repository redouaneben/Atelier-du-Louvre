import type { StaticImageData } from "next/image";

import headerFacade from "../IMGS/Header1.png";
import headerSalle from "../IMGS/Header2.png";
import headerAssiette from "../IMGS/Header3.png";

export type HeroSlide = { src: StaticImageData; alt: string };

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    src: headerFacade,
    alt: "Façade du restaurant L'Atelier du Louvre, le soir",
  },
  {
    src: headerSalle,
    alt: "Salle du restaurant, tables dressées",
  },
  {
    src: headerAssiette,
    alt: "Assiette de saison et crème brûlée",
  },
];
