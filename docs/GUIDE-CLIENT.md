# Guide client — site resto (Mia Pizza / blueprint)

Ce site se met à jour en éditant des **fichiers texte** puis en redéployant (push Git → Vercel rebuild automatique).

## Fichiers à connaître

| Besoin | Fichier |
|--------|---------|
| Nom, tel, adresse, Facebook, SEO | `config/site.ts` |
| SIRET, email contact, gérant | `config/legal.ts` |
| Carte & prix | `data/menu.ts` |
| Horaires semaine | `data/hours.ts` |
| Congés / travaux / fermeture | `data/special-hours.ts` |
| Pizza du mois (photo + recette) | `data/pizza-du-mois.ts` + `IMGS/pizzadumois.jpg` |
| Allergènes par pizza | `data/allergens.ts` |

## Modifier un prix ou une pizza

1. Ouvrir `data/menu.ts`.
2. Repérer la pizza dans `PIZZAS_TOMATE` ou `PIZZAS_CREME`.
3. Changer `name`, `ingredients`, `priceSmall` / `priceLarge`.
4. Enregistrer → commit → push (ou demander une MAJ au prestataire).

## Mettre des congés (2 semaines, etc.)

1. Ouvrir `data/special-hours.ts`.
2. Ajouter un bloc dans `SPECIAL_PERIODS` :

```ts
{
  id: "conges-ete-2027",
  from: "2027-08-01",
  to: "2027-08-15",
  kind: "closed",
  forceClosed: true,
  headline: "Congés",
  badgeLine: "Réouverture le 16 août",
  banner: "Fermeture estivale. Merci de votre compréhension !",
},
```

3. Dates au format `YYYY-MM-DD`, fuseau **Europe/Paris**.
4. Pour désactiver : supprimer le bloc ou vider le tableau `[]`.

## Horaires habituels

Éditer `data/hours.ts` → objet `WEEK_SLOTS` (0 = dimanche … 6 = samedi).  
Minutes depuis minuit : `11 * 60` = 11 h.

## Déploiement (Vercel)

Voir `docs/deploy-vercel.md`.

- Variable **`NEXT_PUBLIC_SITE_URL`** = URL du site (sans `/` final).
- Après changement de variable : **Redeploy** sur Vercel.

## Smoke test (5 min, sur téléphone)

Cocher après chaque mise en ligne :

- [ ] Accueil + slider hero
- [ ] Badge Ouvert / Fermé cohérent
- [ ] Menu tomate / crème + prix lisibles
- [ ] Icône allergènes ouvre la fiche
- [ ] Bouton **Commander** (FAB) lance l’appel
- [ ] Section adresse + carte Maps
- [ ] Liens **Mentions légales** / **Confidentialité**
- [ ] `/sitemap.xml` accessible

## Lighthouse (perf mobile)

1. Chrome → F12 → onglet **Lighthouse** → Mobile → Analyser l’URL prod.
2. Garder une capture (LCP, CLS) pour la livraison client.

## Allergènes

Les listes en ligne sont **indicatives**. Faire valider avec l’affiche boutique avant de retirer le disclaimer.
