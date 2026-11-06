import { siteConfig } from "@/config/site";

/** LocalBusiness / Restaurant pour Google */
export function buildRestaurantJsonLd() {
  const { name, url, phone, email, address, business, facebook } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    url,
    telephone: phone.e164,
    email,
    image: `${url}/opengraph-image`,
    servesCuisine: business.servesCuisine,
    priceRange: business.priceRange,
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      postalCode: address.postalCode,
      addressLocality: address.addressLocality,
      addressCountry: address.addressCountry,
    },
    sameAs: facebook.href ? [facebook.href] : [],
    description: siteConfig.seo.description,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Thursday", "Sunday"],
        opens: "12:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "12:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "19:30",
        closes: "21:30",
      },
    ],
    hasMenu: `${url}/#carte`,
  };
}

export function restaurantJsonLdString() {
  return JSON.stringify(buildRestaurantJsonLd()).replace(/</g, "\\u003c");
}
