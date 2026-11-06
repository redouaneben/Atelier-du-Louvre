# Déploiement Vercel — Mia Pizza

1. Pousser le code sur [Mia-Pizza](https://github.com/redouaneben/Mia-Pizza.git).
2. Vercel → **Import** du repo → Framework **Next.js** (auto).
3. Variable d’environnement :
   - `NEXT_PUBLIC_SITE_URL` = URL du déploiement (ex. `https://mia-pizza.vercel.app`), **sans** slash final.
4. **Redeploy** après ajout de la variable (metadata, sitemap, JSON-LD).
5. Vérifier : `/sitemap.xml`, `/robots.txt`, partage OG (WhatsApp / Facebook debugger).

Identité et SEO : éditer **`config/site.ts`** (blueprint client suivant = même fichier).
