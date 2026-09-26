export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** base64 blur placeholder (Sanity lqip) */
  lqip?: string;
  /** CSS object-position derived from the Sanity hotspot */
  position?: string;
};

export type Video = {
  /** direct mp4/webm file (Sanity upload or CDN) */
  file?: string;
  /** YouTube or Vimeo link */
  url?: string;
  poster?: Img;
};

export type CategoryIcon = "sport" | "lifestyle" | "realestate" | "events" | "video" | "camera";

export type Category = {
  slug: string;
  title: string;
  icon: CategoryIcon;
  cover: Img;
  description?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: Pick<Category, "slug" | "title">;
  /** Small label above the title; defaults to the category title */
  eyebrow?: string;
  services: string;
  summary: string;
  cover: Img;
  gallery: Img[];
  video?: Video;
  client?: string;
  location?: string;
  year?: string;
  featured: boolean;
};

export type Skill = {
  icon: "camera" | "video" | "palette" | "tools" | "pin";
  label: string;
  value: string;
};

export type Settings = {
  name: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroText: string;
  heroImage: Img;
  heroLoop?: string;
  showreel?: Video;
  specialtiesTitle: string;
  specialtiesText: string;
  lensTitle: string;
  lensText: string;
  aboutTitle: string;
  aboutBio: string;
  aboutMission: string;
  portrait: Img;
  signature: string;
  skills: Skill[];
  ctaText: string;
  ctaImage: Img;
  email: string;
  instagram?: string;
  youtube?: string;
  handle: string;
  city: string;
};
