import { locales } from "./i18n";
import { SITE_URL } from "./structured-data";

export const STATIC_PATHS = ["", "/work", "/video", "/photo", "/about", "/contact"] as const;

/** Every public URL of the site in both languages (sitemap, IndexNow). */
export function localizedUrls(paths: readonly string[]) {
  return paths.flatMap((p) => locales.map((l) => `${SITE_URL}/${l}${p}`));
}
