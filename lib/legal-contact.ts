import { legalConfig } from "@/config/legal";
import { siteConfig } from "@/config/site";

const PLACEHOLDER_PREFIX = "[";

export function isLegalPlaceholder(value: string) {
  return value.trim().startsWith(PLACEHOLDER_PREFIX);
}

/** Contact affiché sur les pages légales (email ou tel si placeholder) */
export function getLegalContactDisplay(): {
  kind: "email" | "phone";
  label: string;
  href?: string;
} {
  if (!isLegalPlaceholder(legalConfig.contactEmail)) {
    return {
      kind: "email",
      label: legalConfig.contactEmail,
      href: `mailto:${legalConfig.contactEmail}`,
    };
  }
  return {
    kind: "phone",
    label: siteConfig.phone.display,
    href: siteConfig.phone.href,
  };
}

export function formatLegalField(value: string, fallback: string) {
  return isLegalPlaceholder(value) ? fallback : value;
}
