import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { LensSection } from "@/components/sections/LensSection";
import { Marquee } from "@/components/sections/Marquee";
import { ReelZoom } from "@/components/sections/ReelZoom";
import { Specialties } from "@/components/sections/Specialties";
import { getCategories, getFeaturedProjects, getSettings } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const [s, categories, featured] = await Promise.all([getSettings(), getCategories(), getFeaturedProjects(4)]);
  return (
    <>
      <Hero s={s} />
      <Specialties title={s.specialtiesTitle} text={s.specialtiesText} categories={categories} />
      <FeaturedProjects projects={featured} />
      {s.showreel && <ReelZoom reel={s.showreel} year={String(new Date().getFullYear())} />}
      <Marquee items={categories.map((c) => c.title)} />
      <LensSection title={s.lensTitle} text={s.lensText} />
      <AboutSection s={s} />
      <CtaSection s={s} />
    </>
  );
}
