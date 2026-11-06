import type { Metadata } from "next";

import { LegalContactLine } from "@/components/legal-contact-line";
import { LegalPageShell } from "@/components/legal-page-shell";
import { legalConfig } from "@/config/legal";
import { getFullAddress, siteConfig } from "@/config/site";
import {
  formatLegalField,
  isLegalPlaceholder,
} from "@/lib/legal-contact";

export const metadata: Metadata = {
  title: `Mentions légales | ${siteConfig.name}`,
  description: `Mentions légales du site ${siteConfig.name}.`,
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  const { host } = legalConfig;

  return (
    <LegalPageShell title="Mentions légales">
      <p className="text-sm text-[var(--resto-ink)]/65">
        Dernière mise à jour : {legalConfig.lastUpdated}
      </p>

      <section>
        <h2>1. Éditeur du site</h2>
        <p>
          Le site {siteConfig.url} est édité par{" "}
          <strong>{siteConfig.legalName}</strong>, {siteConfig.tagline}.
        </p>
        <ul>
          <li>
            Adresse : {getFullAddress()}
          </li>
          <li>Téléphone : {siteConfig.phone.display}</li>
          <li>Raison sociale : {legalConfig.companyName}</li>
          <li>
            Responsable de publication :{" "}
            {formatLegalField(
              legalConfig.publisherName,
              `${siteConfig.legalName} (nom du gérant à renseigner dans config/legal.ts)`
            )}{" "}
            ({legalConfig.publisherRole})
          </li>
          <li>
            SIRET :{" "}
            {formatLegalField(
              legalConfig.siret,
              "À renseigner dans config/legal.ts avant facturation"
            )}
          </li>
          {!isLegalPlaceholder(legalConfig.rcs) ? (
            <li>RCS : {legalConfig.rcs}</li>
          ) : null}
          <li>
            Contact : <LegalContactLine />
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Hébergement</h2>
        <p>
          Le site est hébergé par {host.name}, {host.address} (
          <a href={host.website} target="_blank" rel="noopener noreferrer">
            {host.website}
          </a>
          ).
        </p>
      </section>

      <section>
        <h2>3. Propriété intellectuelle</h2>
        <p>
          L’ensemble des éléments du site (textes, visuels, charte graphique,
          structure) est protégé par le droit d’auteur. Toute reproduction non
          autorisée est interdite.
        </p>
      </section>

      <section>
        <h2>4. Données & cartographie</h2>
        <p>
          Une carte Google Maps peut être intégrée sur le site. Son utilisation
          est soumise aux conditions de Google. Voir la{" "}
          <a href="/politique-de-confidentialite">
            politique de confidentialité
          </a>
          .
        </p>
      </section>

      <section>
        <h2>5. Limitation de responsabilité</h2>
        <p>
          Les informations (carte, prix, horaires, allergènes) sont fournies à
          titre indicatif. En cas d’allergie ou de doute, contactez
          l’établissement au {siteConfig.phone.display} ou sur place avant
          de réserver.
        </p>
      </section>
    </LegalPageShell>
  );
}
