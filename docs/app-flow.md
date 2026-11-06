# App Flow — Mia Pizza

## 1. Parcours principal (v1.0 — As-built)

```mermaid
flowchart TD
  A[/ Arrivée /] --> B[Hero: slider + logo]
  B --> C[Statut Ouvert/Fermé]
  B --> D[Voir la carte]
  D --> E[#menu]
  E --> F{Onglet}
  F -->|Tomate| G[Liste PIZZAS_TOMATE]
  F -->|Crème| H[Liste PIZZAS_CREME]
  G --> I[Suppléments + Facebook]
  H --> I
  B --> J[tel: / FAB mobile]
  I --> K[#infos Maps + horaires]
  K --> J
```

## 2. Parcours v2 (Backlog — non implémenté)

```mermaid
flowchart LR
  P[Clic ligne pizza] --> Q[Drawer détail]
  Q --> R[Choix Grande/Petite + suppléments]
  R --> S[Panier ou rappel tel]
```

**Décision produit :** drawer réservé au backlog v2.

## 3. Sections (ancres)

| Section | ID | Action clé |
|---------|-----|------------|
| Hero | — | Statut, `#menu`, tel |
| Carte | `#menu` | Onglets tomate/crème |
| Infos | `#infos` | Maps, copier tel |

## 4. États — ouverture

- **Ouvert** : dans un créneau `WEEK_SLOTS` (`data/hours.ts`)  
- **Fermé** : « Ouvre à … » ou « Hors horaires d'ouverture »  
- Refresh client toutes les 60 s ; hydratation via flag `mounted`
