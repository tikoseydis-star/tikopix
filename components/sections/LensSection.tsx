"use client";

import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { splitTitle } from "@/components/ui/SectionHead";

const LensScene = dynamic(() => import("@/components/three/LensScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <span className="h-16 w-16 animate-spin rounded-full border border-line-strong border-t-violet" />
    </div>
  ),
});

const STOPS = [16, 11, 8, 5.6, 4, 2.8, 2, 1.4];
const SHUTTER = ["1/30", "1/60", "1/125", "1/250", "1/500", "1/1000", "1/2000", "1/4000"];

/** Pinned scroll scene: the 3D lens turns toward you and its iris opens, with a live exposure readout. */
export function LensSection({ title, text }: { title: string; text: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "20% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [stop, setStop] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStop(Math.min(STOPS.length - 1, Math.floor(Math.min(v / 0.7, 0.999) * STOPS.length)));
  });
  const bar = useTransform(scrollYProgress, [0, 0.7], ["0%", "100%"]);
  const glow = useTransform(scrollYProgress, [0, 0.7], [0.15, 0.55]);

  return (
    <section ref={ref} className="relative h-[280vh]" aria-label="L'objectif">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute right-[-10%] top-1/2 h-[80vmin] w-[80vmin] -translate-y-1/2 rounded-full bg-violet blur-[120px]"
          style={{ opacity: glow }}
        />
        <div className="absolute inset-0 lg:left-[38%]">
          <LensScene progress={scrollYProgress} active={inView} />
        </div>

        <div className="container-x pointer-events-none relative flex h-full flex-col justify-end pb-14 lg:justify-center lg:pb-0">
          <div className="max-w-md rounded-lg bg-bg/40 p-1 backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-none">
            <Reveal y={10}>
              <p className="eyebrow mb-4">L&apos;objectif</p>
            </Reveal>
            <MaskLines lines={splitTitle(title)} className="h-display text-[clamp(1.9rem,3.6vw,3rem)]" />
            <Reveal delay={0.15}>
              <p className="mt-6 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-6 font-display tabular-nums">
              <div>
                <p className="eyebrow !text-[9px]">Ouverture</p>
                <p className="mt-2 text-2xl text-fg">f/{STOPS[stop]}</p>
              </div>
              <div>
                <p className="eyebrow !text-[9px]">Vitesse</p>
                <p className="mt-2 text-2xl text-fg">{SHUTTER[stop]}</p>
              </div>
              <div>
                <p className="eyebrow !text-[9px]">ISO</p>
                <p className="mt-2 text-2xl text-fg">100</p>
              </div>
            </div>
            <div className="mt-5 h-px w-full bg-line">
              <motion.div className="h-px bg-violet" style={{ width: bar }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
