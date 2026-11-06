# PRD — Mia Pizza (Landing / consultation & commande par téléphone)

**Version doc :** 1.0  
**Dernière révision :** 2026-03-23  
**Statut produit :** As-built v1.0 livré ; Phase 1 prod (données + SEO) en cours

## 1. Vue d’ensemble

| | |
|---|---|
| **Produit** | Site vitrine one-page — consultation carte + conversion appel |
| **Établissement** | Mia Pizza, pizza à emporter, Saint-Symphorien-d’Ozon |
| **Objectif commercial** | Maximiser appels / emporter ; menu lisible sur mobile (~80 % trafic) |
| **Modèle de commande v1** | Téléphone (`tel:+33472717625`), pas de panier en ligne |

## 2. Personas

- **Client local** : horaires, carte, numéro en 1 clic  
- **Passant** : adresse, plan, carte  
- **Gérant** : site fidèle à la carte imprimée, maintenance minimale (1–2 MAJ/an)

## 3. As-built v1.0 (livrable actuel)

- Hero plein écran + slider (3 photos locales)  
- Badge **Ouvert / Fermé** (Europe/Paris, créneaux carte) + sous-ligne  
- CTA **Voir la carte** → `#menu`  
- Menu **Base tomate / Base crème** ; Grande / Petite ; **Ø** si pas de petite  
- Suppléments (1 € / Bufala 2,50 €) ; allergènes « sur place »  
- Pizza du mois + lien Facebook  
- Coordonnées, horaires texte, iframe Google Maps, copier le numéro  
- FAB mobile **Commander — 04 72 71 76 25**

## 4. Backlog (v1.x / v2)

| Fonction | Priorité | Note |
|----------|----------|------|
| Message congés / fermeture exceptionnelle | P1 | Env ou config |
| Marquee réassurance | P2 | Composant dispo, non branché |
| Avis Google | P2 | Widget ou deep link |
| Onglet Boissons | P2 | Si contenu métier validé |
| WordRotate / TypingAnimation hero | P3 | Effet vitrine |
| BorderBeam sur Maps | P3 | Cosmétique |
| **Drawer / modal détail pizza** | **v2** | Non retenu v1 — liste suffit pour commande tel |
| Supabase + admin carte | **v2** | Non retenu 12 mois — voir `backend-schema.md` |

## 5. Hors scope

Panier, paiement en ligne, compte client, livraison type plateforme (sauf décision ultérieure).

## 6. KPIs (post-déploiement)

- Clics `tel:` (mobile)  
- Ancrage `#menu` (scroll / analytics)  
- Core Web Vitals (LCP, CLS)

## 7. Décisions produit figées (2026-03-23)

1. Pas de modal pizza en v1.  
2. DA = palette code (Vert sapin `#20543B`, Sauge `#719A76`, Papier `#F1EFE5`, Ink `#27251F`).  
3. Données = fichiers `data/*` + déploiement Vercel (pas de DB v1).
