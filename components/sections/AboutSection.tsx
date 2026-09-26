"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { Link, useDict } from "@/components/i18n";
import { useRef } from "react";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { SkillGlyph } from "@/components/ui/Icons";
import type { Settings } from "@/lib/types";

/** Highlights the words that carry the meaning (mockup: bold "sport", "visuels", "émotions"…). */
function emphasize(text: string, words: string[]) {
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    words.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
      <strong key={i} className="font-medium text-fg">{part}</strong>
    ) : (
      part
    ),
  );
}

export function AboutSection({ s, full = false }: { s: Settings; full?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = useDict();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="border-y border-line bg-bg-2" aria-label={s.aboutTitle}>
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Portrait */}
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:min-h-[560px]">
          <motion.div className="absolute inset-[-12%]" style={{ y: imgY }}>
            <Image
              src={s.portrait.src}
              alt={s.portrait.alt}
              fill
              sizes="(min-width:1024px) 30vw, 100vw"
              className="object-cover grayscale contrast-125"
              style={{ objectPosition: s.portrait.position }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg-2/70" />
          <motion.p
            className="absolute bottom-8 right-6 font-sign text-5xl text-fg"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 -10% 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
            aria-label={`${t.about.signature} : ${s.signature}`}
          >
            {s.signature}
          </motion.p>
        </div>

        {/* Story */}
        <div className="px-4 py-14 sm:px-10 lg:px-12 lg:py-20">
          <Reveal y={10}>
            <p className="eyebrow mb-3 !text-[10px]">{t.about.eyebrow}</p>
          </Reveal>
          <MaskLines lines={[s.aboutTitle]} className="h-display text-[clamp(1.6rem,2.6vw,2.2rem)]" />
          <Reveal delay={0.1}>
            <p className="mt-7 text-sm leading-[1.8] text-muted">{emphasize(s.aboutBio, t.about.emphasizeBio)}</p>
            <p className="mt-6 text-sm leading-[1.8] text-fg/90">{emphasize(s.aboutMission, t.about.emphasizeMission)}</p>
          </Reveal>
          {!full && (
            <Reveal delay={0.2} className="mt-10">
              <Link href="/about" className="btn-ghost !py-2.5 !text-xs">
                {t.cta.learnMore} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </Reveal>
          )}
        </div>

        {/* Skills */}
        <ul className="flex flex-col justify-center gap-8 border-t border-line px-4 py-14 sm:px-10 lg:border-l lg:border-t-0 lg:px-12">
          {s.skills.map((k, i) => (
            <li key={k.label}>
              <Reveal delay={i * 0.07} className="flex items-start gap-5">
                <SkillGlyph icon={k.icon} className="mt-0.5 h-6 w-6 shrink-0 text-fg" />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-fg">{k.label}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{k.value}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
