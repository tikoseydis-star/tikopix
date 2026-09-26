import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { LensSection } from "@/components/sections/LensSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSettings } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "About", description: "Djonko Seydi, photographe et vidéaste basé à Montréal." };

const STEPS = [
  { n: "01", t: "On se parle", d: "Ton projet, ton public, l'émotion que tu veux transmettre. On fixe le cadre ensemble." },
  { n: "02", t: "Je prépare", d: "Repérage, lumière, plan de tournage. Rien n'est laissé au hasard le jour J." },
  { n: "03", t: "Je capture", d: "Discret sur le terrain, attentif aux détails. Je guette le moment juste." },
  { n: "04", t: "Je sublime", d: "Tri, retouche Lightroom, montage et colorimétrie DaVinci. Livraison soignée." },
];

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader eyebrow="À propos" title="About" intro={s.heroText} />
      <AboutSection s={s} full />
      <section className="container-x py-24 md:py-32" aria-labelledby="process">
        <Reveal>
          <p className="eyebrow mb-4">Ma façon de travailler</p>
          <h2 id="process" className="h-display text-[clamp(1.9rem,3.6vw,3rem)]">Simple, humain, précis.</h2>
        </Reveal>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((st, i) => (
            <li key={st.n} className="bg-bg">
              <Reveal delay={i * 0.08} className="group h-full p-8 transition-colors duration-500 hover:bg-surface">
                <span className="font-display text-sm text-violet-soft">{st.n}</span>
                <h3 className="mt-10 text-lg font-medium">{st.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{st.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
      <LensSection title={s.lensTitle} text={s.lensText} />
      <CtaSection s={s} />
    </>
  );
}
