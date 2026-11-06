# Design System — Mia Pizza

**Source de vérité :** `lib/colors.ts` (`C`) et composants dans `app/page.tsx`.

## 1. Positionnement

Pizzeria de proximité, artisanale ; retranscription **carte imprimée** ; web sans empattements sauf **Pacifico** pour le nom.

## 2. Couleurs (figées v1)

### Neutres

| Token | Hex | Usage |
|-------|-----|--------|
| paper | `#F1EFE5` | Fond page |
| ink | `#27251F` | Texte |
| white / surface | `#FDFCF8` | Cartes menu, surfaces claires |

### Trois verts (palette unique)

| Token | Hex | Usage |
|-------|-----|--------|
| forest | `#20543B` | Primaire, tomate, CTA, badge ouvert, bordure Maps |
| sage | `#719A76` | Crème, accents, pastille/ping statut ouvert |
| forestDark | `#1a4530` | Hover onglets menu actifs |

> **Retiré v1 :** `#A8D5AA` — remplacé par **sage** pour le statut ouvert.

## 3. Typographie

| Rôle | Police |
|------|--------|
| Marque « Mia Pizza » | Pacifico |
| UI, menu, prix | Plus Jakarta Sans 400–700 |

## 4. Layout

- **`PAGE_SHELL`** : max ~92rem, padding large desktop  
- Mobile-first ; **FAB** fixe bas (`md:hidden`)

## 5. Composants

| Composant | Rôle |
|-----------|------|
| `Ribbon` | Titre section (texte sapin, sans pilule) |
| `MenuCategoryRibbon` | Onglets tomate/crème |
| `HeroStatusCompact` | Ouvert / Fermé (header) |
| `PizzaRow` | Ligne menu (pas de clic v1) |
| `HeroSlider` | Carrousel auto, sans indicateurs dots |
| `LogoLockup` | Identité script |

## 6. Boutons

Variantes dans `lib/mia-button.ts` : surfaces opaques (primary, secondary, command, social, onglets menu).

## 7. Backlog UI

Marquee, BorderBeam, WordRotate, dark mode.
