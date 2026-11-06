import { siteConfig } from "@/config/site";
import { FacebookLink } from "@/components/facebook-link";
import { PAGE_SHELL } from "@/lib/page-shell";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-[var(--resto-paper)] py-10">
      <div className={cn(PAGE_SHELL, "text-center")}>
        <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-[var(--resto-brand)]">
          {siteConfig.name}
        </p>
        <p className="mt-2 text-base text-neutral-300">{siteConfig.footerLine}</p>
        <nav
          aria-label="Pied de page"
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-base"
        >
          <a href="#histoire" className="text-neutral-300 hover:text-neutral-100">
            La maison
          </a>
          <a href="#carte" className="text-neutral-300 hover:text-neutral-100">
            La carte
          </a>
          <a href="#infos" className="text-neutral-300 hover:text-neutral-100">
            Pratique
          </a>
          <a href={siteConfig.phone.href} className="text-neutral-300 hover:text-neutral-100">
            {siteConfig.phone.display}
          </a>
          <a href={`mailto:${siteConfig.email}`} className="text-neutral-300 hover:text-neutral-100">
            {siteConfig.email}
          </a>
          <FacebookLink className="text-neutral-300 hover:text-neutral-100" />
          <a
            href={siteConfig.url}
            className="text-neutral-300 hover:text-neutral-100"
          >
            Site web
          </a>
          <a href="/mentions-legales" className="text-neutral-300 hover:text-neutral-100">
            Mentions légales
          </a>
          <a
            href="/politique-de-confidentialite"
            className="text-neutral-300 hover:text-neutral-100"
          >
            Confidentialité
          </a>
        </nav>
        <p className="mt-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
