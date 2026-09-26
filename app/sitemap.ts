import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tikopix.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    ...["", "/work", "/video", "/photo", "/about", "/contact"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const })),
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}`, changeFrequency: "monthly" as const })),
  ];
}
