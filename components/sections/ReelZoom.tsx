"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { useVideoModal } from "@/components/media/VideoModal";
import type { Video } from "@/lib/types";

/**
 * Pinned section: a small framed showreel grows to full-screen as you scroll,
 * while "SHOW" and "REEL" slide apart (Zoox-style scroll choreography).
 */
export function ReelZoom({ reel, year }: { reel: Video; year: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { open } = useVideoModal();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const clip = useTransform(scrollYProgress, [0, 0.7], ["inset(30% 30% 30% 30% round 14px)", "inset(0% 0% 0% 0% round 0px)"]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [1.3, 1]);
  const leftX = useTransform(scrollYProgress, [0, 0.7], ["0vw", "-30vw"]);
  const rightX = useTransform(scrollYProgress, [0, 0.7], ["0vw", "30vw"]);
  const wordsOpacity = useTransform(scrollYProgress, [0.45, 0.7], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);

  const media = reel.poster;

  return (
    <section ref={ref} className="relative h-[260vh]" aria-label="Showreel">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.button
          type="button"
          onClick={() => open(reel, "Showreel")}
          data-cursor="Play"
          aria-label="Lire le showreel"
          className="absolute inset-0 block"
          style={{ clipPath: reduce ? "inset(0)" : clip }}
        >
          <motion.div className="absolute inset-0" style={{ scale: reduce ? 1 : scale }}>
            {media && <Image src={media.src} alt="" fill sizes="100vw" className="object-cover" />}
            {reel.file && !reduce && (
              <video src={reel.file} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
            )}
            <div className="absolute inset-0 bg-black/35" />
          </motion.div>
        </motion.button>

        <div className="pointer-events-none relative z-10 flex w-full items-center justify-center gap-[3vw] mix-blend-difference">
          <motion.span className="h-display text-[clamp(3rem,14vw,13rem)] text-white" style={{ x: leftX, opacity: wordsOpacity }}>
            Show
          </motion.span>
          <motion.span className="h-display text-[clamp(3rem,14vw,13rem)] text-white" style={{ x: rightX, opacity: wordsOpacity }}>
            Reel
          </motion.span>
        </div>

        <motion.div className="pointer-events-none absolute inset-x-0 bottom-12 z-10 text-center" style={{ opacity: ctaOpacity }}>
          <p className="eyebrow !text-fg/90">Showreel {year}</p>
          <p className="mt-3 font-script text-3xl text-violet-soft sm:text-4xl">Clique pour lancer le son</p>
        </motion.div>
      </div>
    </section>
  );
}
