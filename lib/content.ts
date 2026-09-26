import "server-only";
import { createClient, groq } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";
import type { Locale } from "./i18n";
import { seedCategories, seedEn, seedProjects, seedSettings } from "./seed";
import type { Category, CategoryIcon, Img, Project, Settings, Skill, Video } from "./types";

/**
 * Single content entry point for the site.
 * - Studio connected → reads Sanity (CDN, revalidated every 60s + on-publish webhook).
 * - Studio not connected, or a collection still empty → falls back to the demo seed
 *   so the site never renders blank while Tiko uploads his first projects.
 *
 * Bilingual: every translatable Sanity field has an optional English twin named
 * `<field>En`. On /en the English value is used when filled, otherwise the French one.
 */

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

async function query<T>(q: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(q, params, { next: { revalidate: 60, tags: ["sanity"] } });
  } catch (err) {
    console.error("[content] Sanity query failed, using seed content", err);
    return null;
  }
}

/** English twin when on /en and filled, otherwise the French value. */
function tr<T extends Record<string, unknown>>(obj: T, key: string, lang: Locale): string | undefined {
  const en = lang === "en" ? (obj[`${key}En`] as string | undefined) : undefined;
  return en?.trim() ? en : (obj[key] as string | undefined) || undefined;
}

/* ------------------------------------------------------------------ */
/* Raw shapes + mappers                                                */

type RawImg = {
  src?: string;
  alt?: string;
  w?: number;
  h?: number;
  lqip?: string;
  hotspot?: { x: number; y: number };
} | null;

type RawVideo = { file?: string; url?: string } | null;

const IMG = `{ "src": asset->url, alt, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip, hotspot }`;

function img(raw: RawImg | undefined, fallbackAlt: string, fallback?: Img): Img | undefined {
  if (!raw?.src) return fallback;
  return {
    src: `${raw.src}?auto=format&fit=max&w=2800&q=85`,
    alt: raw.alt || fallbackAlt,
    width: raw.w ?? 2400,
    height: raw.h ?? 1600,
    lqip: raw.lqip,
    position: raw.hotspot ? `${(raw.hotspot.x * 100).toFixed(1)}% ${(raw.hotspot.y * 100).toFixed(1)}%` : undefined,
  };
}

function video(raw: RawVideo | undefined, poster?: Img): Video | undefined {
  if (!raw?.file && !raw?.url) return undefined;
  return { file: raw.file ?? undefined, url: raw.url ?? undefined, poster };
}

/* ------------------------------------------------------------------ */
/* Settings                                                             */

const TEXT_KEYS = [
  "heroEyebrow", "heroTitle", "heroAccent", "heroText",
  "specialtiesTitle", "specialtiesText", "lensTitle", "lensText",
  "aboutTitle", "aboutBio", "aboutMission", "signature", "ctaText",
  "email", "handle", "city",
] as const;

type RawSkill = Skill & { labelEn?: string; valueEn?: string };
type RawSettings = Record<string, unknown> & {
  heroImage?: RawImg;
  portrait?: RawImg;
  ctaImage?: RawImg;
  stageImages?: RawImg[];
  heroLoop?: string;
  showreel?: RawVideo;
  skills?: RawSkill[];
  instagram?: string;
  youtube?: string;
};

function seedSettingsFor(lang: Locale): Settings {
  return lang === "en" ? { ...seedSettings, ...seedEn.settings } : seedSettings;
}

export async function getSettings(lang: Locale): Promise<Settings> {
  const base = seedSettingsFor(lang);
  const raw = await query<RawSettings>(groq`*[_id == "settings"][0]{
    ..., "heroImage": heroImage${IMG}, "portrait": portrait${IMG}, "ctaImage": ctaImage${IMG}, "stageImages": stageImages[]${IMG},
    "heroLoop": heroLoop.asset->url,
    "showreel": showreel{ "file": videoFile.asset->url, "url": videoUrl }
  }`);
  if (!raw) return base;

  const text = Object.fromEntries(TEXT_KEYS.map((k) => [k, tr(raw, k, lang) ?? base[k]])) as Pick<Settings, (typeof TEXT_KEYS)[number]>;
  const heroImage = img(raw.heroImage, "TikoPix", base.heroImage)!;
  return {
    ...base,
    ...text,
    heroImage,
    heroLoop: raw.heroLoop ?? (raw.heroImage?.src ? undefined : base.heroLoop),
    showreel: video(raw.showreel, heroImage) ?? base.showreel,
    portrait: img(raw.portrait, "Portrait", base.portrait)!,
    ctaImage: img(raw.ctaImage, "", base.ctaImage)!,
    stageImages: (() => {
      const list = (raw.stageImages ?? []).map((g, i) => img(g, `Portrait ${i + 1}`)).filter((g): g is Img => !!g);
      return list.length ? list : base.stageImages;
    })(),
    skills: raw.skills?.length
      ? raw.skills.map((s) => ({ icon: s.icon, label: tr(s, "label", lang) ?? "", value: tr(s, "value", lang) ?? "" }))
      : base.skills,
    instagram: raw.instagram ?? base.instagram,
    youtube: raw.youtube ?? base.youtube,
  };
}

/* ------------------------------------------------------------------ */
/* Categories                                                           */

type RawCategory = { slug: string; title: string; titleEn?: string; icon?: CategoryIcon; description?: string; descriptionEn?: string; cover?: RawImg };

function seedCategoriesFor(lang: Locale): Category[] {
  if (lang === "fr") return seedCategories;
  return seedCategories.map((c) => ({ ...c, ...seedEn.categories[c.slug] }));
}

export async function getCategories(lang: Locale): Promise<Category[]> {
  const raw = await query<RawCategory[]>(groq`*[_type == "category" && defined(slug.current)] | order(order asc, title asc){
    "slug": slug.current, title, titleEn, icon, description, descriptionEn, "cover": cover${IMG}
  }`);
  if (!raw?.length) return seedCategoriesFor(lang);
  return raw.map((c) => ({
    slug: c.slug,
    title: tr(c, "title", lang) ?? c.slug,
    icon: c.icon ?? "camera",
    description: tr(c, "description", lang),
    cover: img(c.cover, c.title) ?? seedCategories[0].cover,
  }));
}

/* ------------------------------------------------------------------ */
/* Projects                                                             */

type RawProject = {
  slug: string;
  title: string;
  titleEn?: string;
  category?: { slug: string; title: string; titleEn?: string } | null;
  eyebrow?: string;
  eyebrowEn?: string;
  services?: string;
  servicesEn?: string;
  summary?: string;
  summaryEn?: string;
  cover?: RawImg;
  gallery?: RawImg[];
  video?: RawVideo;
  client?: string;
  location?: string;
  year?: string;
  featured?: boolean;
};

const PROJECT = `{
  "slug": slug.current, title, titleEn, eyebrow, eyebrowEn, services, servicesEn, summary, summaryEn,
  client, location, year, featured,
  "category": category->{ "slug": slug.current, title, titleEn },
  "cover": cover${IMG},
  "gallery": gallery[]${IMG},
  "video": { "file": videoFile.asset->url, "url": videoUrl }
}`;

function mapProject(p: RawProject, lang: Locale): Project {
  const title = tr(p, "title", lang) ?? p.slug;
  const cover = img(p.cover, title) ?? seedProjects[0].cover;
  return {
    slug: p.slug,
    title,
    category: p.category
      ? { slug: p.category.slug, title: tr(p.category, "title", lang) ?? p.category.slug }
      : { slug: "autres", title: lang === "en" ? "Other" : "Autres" },
    eyebrow: tr(p, "eyebrow", lang),
    services: tr(p, "services", lang) ?? "",
    summary: tr(p, "summary", lang) ?? "",
    cover,
    gallery: (p.gallery ?? []).map((g, i) => img(g, `${title} ${i + 1}`)).filter((g): g is Img => !!g),
    video: video(p.video, cover),
    client: p.client,
    location: p.location,
    year: p.year,
    featured: !!p.featured,
  };
}

function seedProjectsFor(lang: Locale): Project[] {
  if (lang === "fr") return seedProjects;
  return seedProjects.map((p) => ({
    ...p,
    ...seedEn.projects[p.slug],
    category: { slug: p.category.slug, title: seedEn.categories[p.category.slug]?.title ?? p.category.title },
  }));
}

export async function getProjects(lang: Locale): Promise<Project[]> {
  const raw = await query<RawProject[]>(
    groq`*[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc)${PROJECT}`,
  );
  if (!raw?.length) return seedProjectsFor(lang);
  return raw.map((p) => mapProject(p, lang));
}

export async function getFeaturedProjects(lang: Locale, limit = 4): Promise<Project[]> {
  const all = await getProjects(lang);
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProject(lang: Locale, slug: string): Promise<{ project: Project; next: Project } | null> {
  const all = await getProjects(lang);
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  return { project: all[i], next: all[(i + 1) % all.length] };
}

/** Every photo across all projects, for the Photo page. */
export async function getPhotoStream(lang: Locale): Promise<{ image: Img; project: Project }[]> {
  const all = await getProjects(lang);
  const seen = new Set<string>();
  return all
    .flatMap((project) => [project.cover, ...project.gallery].map((image) => ({ image, project })))
    .filter(({ image }) => (seen.has(image.src) ? false : (seen.add(image.src), true)));
}
