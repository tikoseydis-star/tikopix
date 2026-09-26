import type { NextConfig } from "next";

/**
 * Language routing without middleware (portable to any host, incl. Netlify):
 * any path without /fr or /en goes to the visitor's language, decided by
 *   1. the choice they made with the FR/EN switch (cookie "tikopix-lang"),
 *   2. otherwise their browser language (Accept-Language starting with "en"),
 *   3. otherwise French.
 * Excluded: /fr, /en, the Studio, API routes, Next internals and files (anything with a dot).
 */
const UNPREFIXED = "/:path((?!(?:fr|en)(?:/|$)|studio(?:/|$)|api/|_next/|.*\\.).+)";
const COOKIE = "tikopix-lang";

function languageRedirects() {
  const rules = [];
  for (const source of ["/", UNPREFIXED]) {
    const dest = (lang: string) => (source === "/" ? `/${lang}` : `/${lang}/:path`);
    rules.push(
      { source, has: [{ type: "cookie" as const, key: COOKIE, value: "en" }], destination: dest("en"), permanent: false },
      { source, has: [{ type: "cookie" as const, key: COOKIE, value: "fr" }], destination: dest("fr"), permanent: false },
      { source, has: [{ type: "header" as const, key: "accept-language", value: "en.*" }], destination: dest("en"), permanent: false },
      { source, destination: dest("fr"), permanent: false },
    );
  }
  return rules;
}

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Demo seed imagery only. Replaced as soon as the Studio has real content.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    qualities: [60, 75, 85],
  },
  async redirects() {
    return languageRedirects();
  },
};

export default nextConfig;
