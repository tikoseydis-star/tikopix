import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { defaultLocale, locales } from "@/lib/i18n";
import { STATIC_PATHS } from "@/lib/site-urls";
import { SITE_URL } from "@/lib/structured-data";

/**
 * Every page in BOTH languages, each with its FR/EN alternates (hreflang), so Google
 * indexes /fr and /en as translations of each other. lastModified comes from the
 * Studio, so Google recrawls what Tiko actually changed.
 */
function entries(path: string, changeFrequency: "weekly" | "monthly", lastModified: Date, priority: number): MetadataRoute.Sitemap {
  const languages = { "fr-CA": `${SITE_URL}/fr${path}`, "en-CA": `${SITE_URL}/en${path}` };
  return locales.map((l) => ({
    url: `${SITE_URL}/${l}${path}`,
    lastModified,
    changeFrequency,
    priority: l === defaultLocale ? priority : priority - 0.1,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects(defaultLocale);
  const newest = projects.reduce((max, p) => (p.updatedAt && new Date(p.updatedAt) > max ? new Date(p.updatedAt) : max), new Date(0));
  const siteUpdated = newest.getTime() > 0 ? newest : new Date();
  return [
    ...STATIC_PATHS.flatMap((p) => entries(p, "weekly", siteUpdated, p === "" ? 1 : 0.8)),
    ...projects.flatMap((p) => entries(`/work/${p.slug}`, "monthly", p.updatedAt ? new Date(p.updatedAt) : siteUpdated, 0.7)),
  ];
}
