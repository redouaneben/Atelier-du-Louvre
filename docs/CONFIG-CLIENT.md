# Configuration client — blueprint resto

Ordre recommandé pour un nouveau site à partir de ce template.

## 1. Identité (`config/site.ts`)

- Nom, téléphone, adresse, textes hero / footer
- SEO (`seo.*`) et URL (`NEXT_PUBLIC_SITE_URL` sur Vercel)
- Facebook : laisser `facebook.href` vide pour masquer le lien

## 2. Design (`config/theme.ts`) — **100 % de la DA couleur**

Toutes les couleurs passent par les variables `--resto-*` injectées dans `app/layout.tsx` :

| Clé | Rôle |
|-----|------|
| `paper` | Fond général, sections |
| `brand` / `brandDark` | Titres, boutons, liens |
| `accent` | Accents, pastilles « ouvert » |
| `ink` | Texte principal |
| `surface` | Cartes, bandeaux clairs |
| `statusClosed` | Badge « fermé » |
| `heroOverlay` | Dégradé sur le slider |
| `decorBrandFilter` | Filtre CSS sur les PNG décoratifs |

**Polices** : renseigner `theme.fonts`, puis modifier `lib/fonts.ts` (Google Fonts).

## 3. Données

| Fichier | Contenu |
|---------|---------|
| `data/menu.ts` | Carte (exemple pizza tomate / crème) |
| `data/hours.ts` | `WEEK_SLOTS` (badge ouvert/fermé) + `HOURS_DISPLAY` (texte affiché) |
| `data/special-hours.ts` | Congés / travaux |
| `data/allergens.ts` | Allergènes par plat |
| `data/pizza-du-mois.ts` | Mise en avant mensuelle |

## 4. Visuels

Voir `IMGS/README.md` et `config/hero-slides.ts`.

## 5. Légal & déploiement

- `config/legal.ts` — SIRET, gérant, email
- `docs/NEW-CLIENT.md`, `docs/smoke-test-checklist.md`, `docs/deploy-vercel.md`

## Dupliquer le projet

```bash
cp -r resto-client-template mon-client-resto
cd mon-client-resto && npm install && npm run dev
```

Sur Windows : copier le dossier hors `node_modules` et `.next`, puis `npm install`.
