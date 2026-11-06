import type { Metadata } from "next";

import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { siteConfig } from "@/config/site";
import { display, sans } from "@/lib/fonts";
import { restaurantJsonLdString } from "@/lib/restaurant-json-ld";
import { themeCssVariables } from "@/lib/theme-css-vars";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.title,
    description: siteConfig.seo.ogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.twitterDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.language}
      className={cn(
        sans.variable,
        display.variable,
        sans.className,
        "h-full scroll-smooth bg-[var(--resto-paper)] antialiased"
      )}
      style={{ ...themeCssVariables(), colorScheme: "dark" }}
    >
      <body className="flex min-h-full flex-col bg-[var(--resto-paper)] text-neutral-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: restaurantJsonLdString() }}
        />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
