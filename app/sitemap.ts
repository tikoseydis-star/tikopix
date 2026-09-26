import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { defaultLocale } from "@/lib/i18n";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tikopix.com";

/** One entry per page, with its FR/EN alternates (hreflang). */
function entry(path: string, changeFrequency: "weekly" | "monthly"): MetadataRoute.Sitemap[number] {
  return {
    url: `${base}/${defaultLocale}${path}`,
    changeFrequency,
    alternates: { languages: { "fr-CA": `${base}/fr${path}`, "en-CA": `${base}/en${path}` } },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects(defaultLocale);
  return [
    ...["", "/work", "/video", "/photo", "/about", "/contact"].map((p) => entry(p, "weekly")),
    ...projects.map((p) => entry(`/work/${p.slug}`, "monthly")),
  ];
}
