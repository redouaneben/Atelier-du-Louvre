# Images client

Remplacer les fichiers de démo par les visuels du restaurant.

| Usage | Fichiers / config |
|--------|-------------------|
| Slider accueil | `config/hero-slides.ts` → imports dans ce dossier |
| Plat du mois | `data/pizza-du-mois.ts` + photo (ex. `pizzadumois.jpg`) |
| Décor (herbes, bandeau) | PNG existants ; teinte via `config/theme.ts` → `decorBrandFilter` |

Formats conseillés : JPG/WebP pour photos (hero ~1920×1080), PNG pour décor transparent.
