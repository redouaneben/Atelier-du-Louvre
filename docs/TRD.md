# TRD — Mia Pizza

## 1. Stack As-built

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js **16.4** (App Router) |
| UI | React **19**, TypeScript strict |
| Page principale | `app/page.tsx` — **Client Component** (`"use client"`) |
| Styles | Tailwind CSS **4** |
| Motion | `motion/react` |
| Icônes | `lucide-react` (+ SVG Facebook local) |
| Fonts | Pacifico (logo), Plus Jakarta Sans (UI) via `next/font/google` |
| Utils | `cn` — `@/lib/utils` |
| Hébergement cible | **Vercel** |
| Données v1 | **`data/menu.ts`**, **`data/hours.ts`** |

## 2. Architecture v1

```
Navigateur → Next.js → app/page.tsx
                    → data/menu.ts, data/hours.ts
                    → IMGS/* (imports statiques)
                    → Externe : Maps iframe, Facebook, tel:
```

**Pas d’API Route métier** en v1.

## 3. Logique métier (client)

- **`getOpenStatus(now)`** + **`WEEK_SLOTS`** dans `data/hours.ts`  
- Fuseau : **Europe/Paris** (`getParisDate`)  
- Menu : state `menuTab`: `"tomate" | "creme"`

## 4. Exigences non fonctionnelles

| Domaine | Cible |
|---------|--------|
| Mobile | Zones tactiles ≥ 48px (FAB, rubans, liens) |
| Perf | LCP hero optimisé (`next/image`, assets locaux) |
| A11y | `aria-pressed` (onglets), `role="status"` (ouverture) |
| SEO | Metadata FR, `lang="fr"`, Open Graph — `app/layout.tsx` |
| i18n | FR uniquement |

## 5. Dette / maintenance

- Composants UI starter (`components/ui/*`) partiellement utilisés  
- Composant `smoothui/calendar` retiré (dépendance `react-day-picker` non requise)

## 6. Backlog technique v2

- Supabase PostgreSQL + API — voir `backend-schema.md`  
- Option split Server/Client pour SEO avancé
