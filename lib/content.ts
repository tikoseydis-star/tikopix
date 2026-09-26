import "server-only";
import { createClient, groq } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";
import { seedCategories, seedProjects, seedSettings } from "./seed";
import type { Category, CategoryIcon, Img, Project, Settings, Skill, Video } from "./types";

/**
 * Single content entry point for the site.
 * - Studio connected → reads Sanity (CDN, revalidated every 60s + on-publish webhook).
 * - Studio not connected, or a collection still empty → falls back to the demo seed
 *   so the site never renders blank while Tiko uploads his first projects.
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

type RawSettings = Partial<Omit<Settings, "heroImage" | "portrait" | "ctaImage" | "showreel" | "heroLoop" | "skills">> & {
  heroImage?: RawImg;
  portrait?: RawImg;
  ctaImage?: RawImg;
  heroLoop?: string;
  showreel?: RawVideo;
  skills?: Skill[];
};

export async function getSettings(): Promise<Settings> {
  const raw = await query<RawSettings>(groq`*[_id == "settings"][0]{
    ..., "heroImage": heroImage${IMG}, "portrait": portrait${IMG}, "ctaImage": ctaImage${IMG},
    "heroLoop": heroLoop.asset->url,
    "showreel": showreel{ "file": videoFile.asset->url, "url": videoUrl }
  }`);
  if (!raw) return seedSettings;

  const s = seedSettings;
  const pick = <K extends keyof Settings>(k: K) => ((raw[k as keyof RawSettings] as Settings[K]) || s[k]);
  const heroImage = img(raw.heroImage, "TikoPix", s.heroImage)!;
  return {
    ...s,
    name: pick("name"),
    heroEyebrow: pick("heroEyebrow"),
    heroTitle: pick("heroTitle"),
    heroAccent: pick("heroAccent"),
    heroText: pick("heroText"),
    heroImage,
    heroLoop: raw.heroLoop ?? (raw.heroImage?.src ? undefined : s.heroLoop),
    showreel: video(raw.showreel, heroImage) ?? s.showreel,
    specialtiesTitle: pick("specialtiesTitle"),
    specialtiesText: pick("specialtiesText"),
    lensTitle: pick("lensTitle"),
    lensText: pick("lensText"),
    aboutTitle: pick("aboutTitle"),
    aboutBio: pick("aboutBio"),
    aboutMission: pick("aboutMission"),
    portrait: img(raw.portrait, "Portrait", s.portrait)!,
    signature: pick("signature"),
    skills: raw.skills?.length ? raw.skills : s.skills,
    ctaText: pick("ctaText"),
    ctaImage: img(raw.ctaImage, "", s.ctaImage)!,
    email: pick("email"),
    instagram: raw.instagram ?? s.instagram,
    youtube: raw.youtube ?? s.youtube,
    handle: pick("handle"),
    city: pick("city"),
  };
}

/* ------------------------------------------------------------------ */
/* Categories                                                           */

type RawCategory = { slug: string; title: string; icon?: CategoryIcon; description?: string; cover?: RawImg };

export async function getCategories(): Promise<Category[]> {
  const raw = await query<RawCategory[]>(groq`*[_type == "category" && defined(slug.current)] | order(order asc, title asc){
    "slug": slug.current, title, icon, description, "cover": cover${IMG}
  }`);
  if (!raw?.length) return seedCategories;
  return raw.map((c) => ({
    slug: c.slug,
    title: c.title,
    icon: c.icon ?? "camera",
    description: c.description,
    cover: img(c.cover, c.title) ?? seedCategories[0].cover,
  }));
}

/* ------------------------------------------------------------------ */
/* Projects                                                             */

type RawProject = {
  slug: string;
  title: string;
  category?: { slug: string; title: string } | null;
  eyebrow?: string;
  services?: string;
  summary?: string;
  cover?: RawImg;
  gallery?: RawImg[];
  video?: RawVideo;
  client?: string;
  location?: string;
  year?: string;
  featured?: boolean;
};

const PROJECT = `{
  "slug": slug.current, title, eyebrow, services, summary, client, location, year, featured,
  "category": category->{ "slug": slug.current, title },
  "cover": cover${IMG},
  "gallery": gallery[]${IMG},
  "video": { "file": videoFile.asset->url, "url": videoUrl }
}`;

function mapProject(p: RawProject): Project {
  const cover = img(p.cover, p.title) ?? seedProjects[0].cover;
  return {
    slug: p.slug,
    title: p.title,
    category: p.category ?? { slug: "autres", title: "Autres" },
    eyebrow: p.eyebrow,
    services: p.services ?? "",
    summary: p.summary ?? "",
    cover,
    gallery: (p.gallery ?? []).map((g, i) => img(g, `${p.title} ${i + 1}`)).filter((g): g is Img => !!g),
    video: video(p.video, cover),
    client: p.client,
    location: p.location,
    year: p.year,
    featured: !!p.featured,
  };
}

export async function getProjects(): Promise<Project[]> {
  const raw = await query<RawProject[]>(
    groq`*[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc)${PROJECT}`,
  );
  if (!raw?.length) return seedProjects;
  return raw.map(mapProject);
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProject(slug: string): Promise<{ project: Project; next: Project } | null> {
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  return { project: all[i], next: all[(i + 1) % all.length] };
}

/** Every photo across all projects, for the Photo page. */
export async function getPhotoStream(): Promise<{ image: Img; project: Project }[]> {
  const all = await getProjects();
  const seen = new Set<string>();
  return all
    .flatMap((project) => [project.cover, ...project.gallery].map((image) => ({ image, project })))
    .filter(({ image }) => (seen.has(image.src) ? false : (seen.add(image.src), true)));
}
