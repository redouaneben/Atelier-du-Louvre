import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const SHELL =
  "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16 lg:max-w-4xl";

export function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--resto-paper)] pb-16 text-[var(--resto-ink)]">
      <header className="border-b border-zinc-800 bg-[var(--resto-surface)]">
        <div
          className={cn(
            SHELL,
            "flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
          )}
        >
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-wide text-[var(--resto-brand)] underline-offset-4 hover:underline"
          >
            ← {siteConfig.name}
          </Link>
          <p className="text-sm font-medium text-[var(--resto-ink)]/70">
            {siteConfig.phone.display}
          </p>
        </div>
      </header>

      <main className={SHELL}>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--resto-brand)] sm:text-3xl">
          {title}
        </h1>
        <article
          className={cn(
            "prose-legal mt-8 space-y-6 text-base leading-relaxed text-[var(--resto-ink)]/90",
            "sm:text-lg [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[var(--resto-brand)]",
            "[&_a]:font-semibold [&_a]:text-[var(--resto-brand)] [&_a]:underline-offset-4 hover:[&_a]:underline",
            "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
          )}
        >
          {children}
        </article>

        <nav
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-800 pt-8 text-sm font-medium"
          aria-label="Autres pages légales"
        >
          <Link href="/mentions-legales" className="text-[var(--resto-brand)] hover:underline">
            Mentions légales
          </Link>
          <Link
            href="/politique-de-confidentialite"
            className="text-[var(--resto-brand)] hover:underline"
          >
            Politique de confidentialité
          </Link>
          <Link href="/" className="text-[var(--resto-ink)]/70 hover:underline">
            Accueil
          </Link>
        </nav>
      </main>
    </div>
  );
}
