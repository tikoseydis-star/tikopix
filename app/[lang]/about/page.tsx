import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FilmSteps } from "@/components/sections/FilmSteps";
import { StageSection } from "@/components/sections/StageSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSettings } from "@/lib/content";
import { getDict, localizedMeta, pageLang } from "@/lib/page-lang";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const lang = await pageLang(params);
  return localizedMeta(lang, "/about", getDict(lang).pages.about, getDict(lang).meta.about);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const lang = await pageLang(params);
  const t = getDict(lang);
  const s = await getSettings(lang);
  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title={t.pages.about} intro={s.heroText} />
      <AboutSection s={s} full />
      <section className="container-x overflow-x-clip py-24 md:py-32" aria-labelledby="process">
        <Reveal>
          <p className="eyebrow mb-4">{t.about.processEyebrow}</p>
          <h2 id="process" className="h-display text-[clamp(1.9rem,3.6vw,3rem)]">{t.about.processTitle}</h2>
        </Reveal>
        <FilmSteps steps={t.about.steps} />
      </section>
      <StageSection title={s.lensTitle} text={s.lensText} images={s.stageImages} />
      <CtaSection s={s} />
    </>
  );
}
