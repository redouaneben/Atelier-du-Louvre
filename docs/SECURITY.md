# Sécurité & conformité — blueprint resto

## Déjà en place

- Site statique (pas d’API, pas de BDD, pas de secrets dans le repo).
- En-têtes HTTP : `lib/security-headers.ts` → `next.config.ts`.
- JSON-LD échappé (`\u003c`) dans `lib/restaurant-json-ld.ts`.
- Pages légales + bandeau cookies (`CookieConsentBanner`).
- 404 brandée : `app/not-found.tsx`.

## Avant facturation client

1. Remplir **`config/legal.ts`** (SIRET, gérant, email).
2. Valider allergènes avec l’affiche boutique.
3. `npm audit` — au dernier contrôle : aucune vulnérabilité **high/critical** ; 3 **low** dans le CLI `shadcn` (dev, pas runtime prod). Ne pas lancer `npm audit fix --force` sans test (breaking).
4. Vercel : `NEXT_PUBLIC_SITE_URL` en production.

## Maintenance

- Après ajout d’analytics : MAJ politique de confidentialité + consentement.
- Si nouvelle iframe tierce : ajuster `Content-Security-Policy` dans `lib/security-headers.ts`.
