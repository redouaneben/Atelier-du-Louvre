# Nouveau client — checklist blueprint

1. **Dupliquer** le repo (ou branche) Mia-Pizza / resto-starter-kit.
2. **`config/site.ts`** — nom, tel, adresse, Facebook, SEO, textes hero/footer.
3. **`config/theme.ts`** — couleurs (`--resto-*` injectées dans `app/layout.tsx`) + polices (puis `lib/fonts.ts`).
4. **`config/legal.ts`** — SIRET, gérant, email.
5. **`config/hero-slides.ts`** — remplacer les imports `IMGS/` (photos client).
6. **`data/menu.ts`**, **`data/hours.ts`**, **`data/allergens.ts`**, **`data/special-hours.ts`**.
7. **`public/`** — favicon optionnel ; OG généré via `app/opengraph-image.tsx`.
8. Vercel : nouveau projet, `NEXT_PUBLIC_SITE_URL`, deploy.
9. Smoke test : `docs/smoke-test-checklist.md`.

UI principale : `components/home/home-page.tsx` (sections à extraire au fil des projets).
