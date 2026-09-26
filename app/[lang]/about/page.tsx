import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { StageSection } from "@/components/sections/StageSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSettings } from "@/lib/content";
import { getDict, localizedMeta, pageLang } from "@/lib/page-lang";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const lang = await pageLang(params);
  return localizedMeta(lang, "/about", "About", getDict(lang).meta.about);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const lang = await pageLang(params);
  const t = getDict(lang);
  const s = await getSettings(lang);
  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title="About" intro={s.heroText} />
      <AboutSection s={s} full />
      <section className="container-x py-24 md:py-32" aria-labelledby="process">
        <Reveal>
          <p className="eyebrow mb-4">{t.about.processEyebrow}</p>
          <h2 id="process" className="h-display text-[clamp(1.9rem,3.6vw,3rem)]">{t.about.processTitle}</h2>
        </Reveal>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {t.about.steps.map((st, i) => (
            <li key={st.t} className="bg-bg">
              <Reveal delay={i * 0.08} className="group h-full p-8 transition-colors duration-500 hover:bg-surface">
                <span className="font-display text-sm text-violet-soft">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-10 text-lg font-medium">{st.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{st.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
      <StageSection title={s.lensTitle} text={s.lensText} images={s.stageImages} />
      <CtaSection s={s} />
    </>
  );
}
