"use client";

import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useDict } from "@/components/i18n";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { splitTitle } from "@/components/ui/SectionHead";
import type { Img } from "@/lib/types";

const VelvetStage = dynamic(() => import("@/components/three/VelvetStage"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#12051b]">
      <span className="h-16 w-16 animate-spin rounded-full border border-line-strong border-t-violet" />
    </div>
  ),
});

const STOPS = [2.8, 2, 1.4];
const SHUTTER = ["1/125", "1/160", "1/200"];

/**
 * Pinned scroll scene: Tiko's portraits hang in 3D in front of a mauve velvet curtain;
 * scrolling turns the carousel to bring each print under the spotlight.
 */
export function StageSection({ title, text, images }: { title: string; text: string; images: Img[] }) {
  const ref = useRef<HTMLElement>(null);
  const t = useDict();
  const inView = useInView(ref, { margin: "20% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const count = images.length;
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIndex(Math.round(Math.min(Math.max(v / 0.85, 0), 1) * (count - 1)));
  });
  const bar = useTransform(scrollYProgress, [0, 0.85], ["0%", "100%"]);
  const s = index % STOPS.length;

  if (!count) return null;

  return (
    <section ref={ref} className="relative bg-[#12051b]" style={{ height: `${120 + count * 60}vh` }} aria-label={t.lens.eyebrow}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[62%] lg:inset-y-0 lg:left-[30%] lg:right-0 lg:h-full">
          <VelvetStage images={images} progress={scrollYProgress} active={inView} />
        </div>
        {/* Legibility veil on the text side */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12051b] via-[#12051b]/40 to-transparent lg:bg-gradient-to-r lg:from-[#12051b] lg:via-[#12051b]/70 lg:to-transparent lg:[background-size:55%_100%] lg:bg-no-repeat" />

        <div className="container-x pointer-events-none relative flex h-full flex-col justify-end pb-14 lg:justify-center lg:pb-0">
          <div className="max-w-md">
            <Reveal y={10}>
              <p className="eyebrow mb-4 !text-violet-soft">{t.lens.eyebrow}</p>
            </Reveal>
            <MaskLines lines={splitTitle(title)} className="h-display text-[clamp(1.9rem,3.6vw,3rem)]" />
            <Reveal delay={0.15}>
              <p className="mt-6 text-sm leading-relaxed text-fg/70">{text}</p>
            </Reveal>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 font-display tabular-nums">
              <div>
                <p className="eyebrow !text-[9px]">{t.lens.aperture}</p>
                <p className="mt-2 text-2xl text-fg">f/{STOPS[s]}</p>
              </div>
              <div>
                <p className="eyebrow !text-[9px]">{t.lens.shutter}</p>
                <p className="mt-2 text-2xl text-fg">{SHUTTER[s]}</p>
              </div>
              <div>
                <p className="eyebrow !text-[9px]">Portrait</p>
                <p className="mt-2 text-2xl text-fg">
                  {String(index + 1).padStart(2, "0")}
                  <span className="text-fg/40"> / {String(count).padStart(2, "0")}</span>
                </p>
              </div>
            </div>
            <div className="mt-5 h-px w-full bg-white/10">
              <motion.div className="h-px bg-violet" style={{ width: bar }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
