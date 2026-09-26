"use client";

import { ArrowDown } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PlayButton } from "@/components/media/PlayButton";
import { MaskLines } from "@/components/motion/Reveal";
import { useLenis } from "@/components/motion/SmoothScroll";
import type { Settings } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Splits "Visual stories, captured with" into two display lines at the comma. */
function titleLines(title: string) {
  const i = title.indexOf(",");
  return i > -1 ? [title.slice(0, i + 1), title.slice(i + 1).trim()] : [title];
}

export function Hero({ s }: { s: Settings }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Pointer parallax on the background
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * -24);
      py.set((e.clientY / window.innerHeight - 0.5) * -16);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [px, py, reduce]);

  const [line1, line2] = titleLines(s.heroTitle);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden grain" aria-label="Introduction">
      <motion.div className="absolute inset-[-3%]" style={{ x: px, y: py }}>
      <motion.div className="absolute inset-0" style={{ scale: reduce ? 1.05 : bgScale, y: reduce ? 0 : bgY }}>
        <Image
          src={s.heroImage.src}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          placeholder={s.heroImage.lqip ? "blur" : "empty"}
          blurDataURL={s.heroImage.lqip}
          className="object-cover"
          style={{ objectPosition: s.heroImage.position }}
        />
        {s.heroLoop && !reduce && (
          <video
            src={s.heroLoop}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${videoReady ? "opacity-100" : "opacity-0"}`}
            aria-hidden
          />
        )}
      </motion.div>
      </motion.div>

      {/* Cinematic grading: dark left for legibility, deep bottom into the page */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/45 to-bg/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-bg/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(139,108,255,0.18),transparent_55%)]" />

      <motion.div className="container-x relative z-10 flex h-full flex-col justify-end pb-16 sm:pb-20" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.p className="eyebrow mb-5 !text-fg/80" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1, ease: EASE }}>
          {s.heroEyebrow}
        </motion.p>

        <h1 className="h-display max-w-5xl text-[clamp(2.6rem,7.4vw,6.6rem)] text-fg">
          <MaskLines as="p" lines={[line1]} animateOnMount delay={0.35} />
          <span className="flex flex-wrap items-baseline gap-x-[0.28em]">
            {line2 && <MaskLines as="p" lines={[line2]} animateOnMount delay={0.45} />}
            <motion.span
              className="script whitespace-nowrap pr-2 normal-case text-[1.02em]"
              initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 -5% 0 0)" }}
              transition={{ delay: 1.05, duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            >
              {s.heroAccent.toUpperCase()}
              <span className="text-fg">.</span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-7 max-w-[34rem] text-[15px] leading-relaxed text-fg/85"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1, ease: EASE }}
        >
          {s.heroText}
        </motion.p>

        <motion.div
          className="mt-10 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          {s.showreel ? <PlayButton video={s.showreel} label="Voir le showreel" title="Showreel" /> : <span />}
          <button
            type="button"
            onClick={() => {
              const target = ref.current?.nextElementSibling as HTMLElement | null;
              if (!target) return;
              if (lenis) lenis.scrollTo(target, { duration: 1.4 });
              else target.scrollIntoView({ behavior: "smooth" });
            }}
            className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-fg/70 transition-colors hover:text-fg sm:flex"
          >
            Scroll
            <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <ArrowDown className="h-4 w-4" strokeWidth={1.4} />
            </motion.span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
