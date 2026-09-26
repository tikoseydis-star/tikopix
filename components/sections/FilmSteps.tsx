"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

type Step = { t: string; d: string };

const AMBER = "#d9822b"; // film edge-print orange
const BASE = "#140e0b"; // film base, warm brown-black
const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Painted brush stroke: a rect roughened by SVG turbulence (dry-brush */
/* streaks + ragged edges), "painted" top to bottom on scroll.         */

function BrushStroke({ className, width, seed, delay = 0, opacity = 0.92 }: { className: string; width: number; seed: number; delay?: number; opacity?: number }) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  return (
    <motion.svg
      aria-hidden
      className={`pointer-events-none absolute z-20 ${className}`}
      viewBox={`0 0 ${width + 20} 1000`}
      preserveAspectRatio="none"
      style={{ width: width + 20, transformOrigin: "top" }}
      initial={reduce ? false : { scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay }}
    >
      <defs>
        <filter id={`b${id}`} x="-40%" y="-2%" width="180%" height="104%">
          {/* vertical dry-brush streaks */}
          <feTurbulence type="fractalNoise" baseFrequency="0.55 0.004" numOctaves="2" seed={seed} result="streak" />
          <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.55" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="textured" />
          {/* ragged, wobbly edges */}
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.01" numOctaves="2" seed={seed + 7} result="edge" />
          <feDisplacementMap in="textured" in2="edge" scale={Math.max(3, width * 0.22)} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path
        d={`M ${10 + width * 0.35} 4 C ${10 + width * 0.9} 40, ${10 + width} 140, ${10 + width} 320 L ${10 + width * 0.92} 820 C ${10 + width * 0.85} 930, ${10 + width * 0.6} 985, ${10 + width * 0.55} 996 C ${10 + width * 0.4} 960, ${10 + width * 0.1} 900, 10 780 L 10 260 C 10 120, ${10 + width * 0.1} 40, ${10 + width * 0.35} 4 Z`}
        fill="#8b6cff"
        opacity={opacity}
        filter={`url(#b${id})`}
      />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* Film rail: sprocket holes + Kodak-style edge print                  */

function Rail({ side, labels }: { side: "left" | "right"; labels: string[] }) {
  const holes = (
    <div className="flex h-full flex-col justify-between overflow-hidden py-2">
      {Array.from({ length: 34 }, (_, i) => (
        <span key={i} className="block h-[11px] w-[15px] shrink-0 rounded-[3px] bg-[#07070a] shadow-[inset_0_0_0_1px_rgba(255,236,210,0.22)]" />
      ))}
    </div>
  );
  const print = (
    <div className="relative flex h-full flex-col items-center justify-around py-6" style={{ color: AMBER }}>
      {labels.map((l, i) => (
        <span key={i} className="flex flex-col items-center gap-3">
          <span className="font-mono text-[9px] font-semibold tracking-[0.25em] [writing-mode:vertical-rl]" style={{ transform: side === "left" ? "rotate(180deg)" : undefined }}>
            TIKOPIX 400 ▸ {l}
          </span>
          {/* DX barcode ticks */}
          <span className="block h-10 w-[5px] opacity-80" style={{ background: `repeating-linear-gradient(to bottom, ${AMBER} 0 2px, transparent 2px 5px, ${AMBER} 5px 6px, transparent 6px 9px)` }} />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden className={`flex w-[42px] shrink-0 gap-1 px-1.5 sm:w-[46px] ${side === "right" ? "flex-row-reverse" : ""}`}>
      {holes}
      {print}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Frame: an aged contact-print paper holding one step                 */

function Frame({ n, step }: { n: number; step: Step }) {
  return (
    <li className="relative flex flex-col overflow-hidden rounded-[1px] bg-[#ece4d3] px-6 pb-7 pt-6 text-[#1b1511] sm:aspect-[5/6] sm:px-8 sm:pt-7">
      {/* paper aging: warm light leak, vignette, fine grain */}
      <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(233,146,60,0.35),transparent_70%)]" />
      <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(80,50,20,0.28)]" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <span className="relative font-display text-[44px] font-semibold leading-none tracking-tight text-[#1b1511]/85 sm:text-[56px]" style={{ fontStretch: "112%" }}>
        {String(n).padStart(2, "0")}
      </span>
      {/* title + text sit at the foot of the frame, like a caption on a print */}
      <div className="relative mt-6 sm:mt-auto">
        <span aria-hidden className="mb-4 block h-px w-10 bg-[#1b1511]/40" />
        <h3 className="font-display text-xl font-semibold uppercase tracking-[0.02em]" style={{ fontStretch: "108%" }}>
          {step.t}
        </h3>
        <p className="mt-3 max-w-[30ch] text-[14px] leading-relaxed text-[#1b1511]/72">{step.d}</p>
      </div>
      <span aria-hidden className="absolute bottom-3 right-4 font-mono text-[9px] tracking-[0.3em] text-[#1b1511]/35">
        {n}A
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */

function Strip({ steps, start, tilt, delay }: { steps: Step[]; start: number; tilt: number; delay: number }) {
  const reduce = useReducedMotion();
  const labels = steps.map((_, i) => String(start + i));
  return (
    <motion.div
      className="relative flex"
      style={{ background: BASE }}
      initial={reduce ? false : { opacity: 0, y: 80, rotate: tilt * 4 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      {/* film burn at the ends */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[rgba(217,130,43,0.35)] to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[rgba(217,130,43,0.25)] to-transparent" />
      <Rail side="left" labels={labels} />
      <ol className="flex flex-1 flex-col gap-3.5 py-4" start={start}>
        {steps.map((s, i) => (
          <Frame key={s.t} n={start + i} step={s} />
        ))}
      </ol>
      <Rail side="right" labels={labels} />
    </motion.div>
  );
}

/** "How I work" as two strips of 35mm film, like a photographer's contact sheet. */
export function FilmSteps({ steps }: { steps: Step[] }) {
  const half = Math.ceil(steps.length / 2);
  return (
    <div className="relative mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-8">
      <Strip steps={steps.slice(0, half)} start={1} tilt={-0.6} delay={0} />
      <Strip steps={steps.slice(half)} start={half + 1} tilt={0.5} delay={0.15} />
      {/* violet brush strokes painted over the film, as on a marked-up contact sheet */}
      <BrushStroke className="-top-10 left-[14px] h-[62%]" width={9} seed={3} delay={0.5} opacity={0.85} />
      <BrushStroke className="hidden md:block left-[calc(50%-34px)] top-[26%] h-[56%]" width={30} seed={11} delay={0.8} />
      <BrushStroke className="-bottom-12 right-[12px] h-[48%]" width={7} seed={19} delay={1.05} opacity={0.8} />
    </div>
  );
}
