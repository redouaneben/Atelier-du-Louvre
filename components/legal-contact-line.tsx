import { getLegalContactDisplay } from "@/lib/legal-contact";

export function LegalContactLine() {
  const contact = getLegalContactDisplay();
  if (contact.href) {
    return (
      <a href={contact.href} className="font-semibold underline-offset-2 hover:underline">
        {contact.label}
      </a>
    );
  }
  return <span>{contact.label}</span>;
}
