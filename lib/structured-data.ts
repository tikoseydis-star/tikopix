import type { Locale } from "./i18n";
import type { Settings } from "./types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tikopix.com").replace(/\/$/, "");

/**
 * schema.org description of the business and the person behind it, so Google can show
 * a proper card (name, job, city, Instagram) and link the FR/EN pages to one entity.
 */
export function siteJsonLd(lang: Locale, s: Settings, description: string) {
  const sameAs = [s.instagram, s.youtube].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "TikoPix",
        inLanguage: ["fr-CA", "en-CA"],
        publisher: { "@id": `${SITE_URL}/#business` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#business`,
        name: "TikoPix",
        url: `${SITE_URL}/${lang}`,
        description,
        logo: `${SITE_URL}/apple-icon.png`,
        image: `${SITE_URL}/apple-icon.png`,
        email: s.email,
        areaServed: { "@type": "City", name: "Montréal" },
        address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC", addressCountry: "CA" },
        knowsLanguage: ["fr", "en"],
        founder: { "@id": `${SITE_URL}/#person` },
        sameAs,
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: s.signature,
        jobTitle: lang === "fr" ? "Photographe et vidéaste" : "Photographer and videographer",
        worksFor: { "@id": `${SITE_URL}/#business` },
        homeLocation: { "@type": "City", name: "Montréal" },
        sameAs,
      },
    ],
  };
}

/** JSON for a <script type="application/ld+json">, safe against "</script>" injection. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
