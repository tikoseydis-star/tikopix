import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { StageSection } from "@/components/sections/StageSection";
import { Marquee } from "@/components/sections/Marquee";
import { ReelZoom } from "@/components/sections/ReelZoom";
import { Specialties } from "@/components/sections/Specialties";
import { getCategories, getFeaturedProjects, getSettings } from "@/lib/content";
import { getDict, localizedMeta, pageLang } from "@/lib/page-lang";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = await pageLang(params);
  return localizedMeta(lang, "", undefined, getDict(lang).meta.description);
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const lang = await pageLang(params);
  const t = getDict(lang);
  const [s, categories, featured] = await Promise.all([getSettings(lang), getCategories(lang), getFeaturedProjects(lang, 4)]);
  return (
    <>
      <Hero s={s} />
      <Specialties title={s.specialtiesTitle} text={s.specialtiesText} categories={categories} t={t} />
      <FeaturedProjects projects={featured} t={t} />
      {s.showreel && <ReelZoom reel={s.showreel} year={String(new Date().getFullYear())} />}
      <Marquee items={categories.map((c) => c.title)} />
      <StageSection title={s.lensTitle} text={s.lensText} images={s.stageImages} />
      <AboutSection s={s} />
      <CtaSection s={s} />
    </>
  );
}
