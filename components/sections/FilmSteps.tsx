"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

type Step = { t: string; d: string };
type Dir = "h" | "v";

const MAUVE = "#b9a6ff"; // film edge-print, in TikoPix mauve
const BASE = "#1a1310"; // film base, warm brown-black (reads against the black prints)
const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Painted brush stroke: a tapered shape roughened by SVG turbulence   */
/* (dry-brush streaks + ragged edges), painted along its length.       */

/** Tapered stroke outline along the length axis (0..1000), across 10..10+w. */
function strokeOutline(w: number, dir: Dir) {
  const P = (along: number, across: number) => (dir === "v" ? `${10 + across} ${along}` : `${along} ${10 + across}`);
  return `M ${P(4, w * 0.35)} C ${P(40, w * 0.9)}, ${P(140, w)}, ${P(320, w)} L ${P(820, w * 0.92)} C ${P(930, w * 0.85)}, ${P(985, w * 0.6)}, ${P(996, w * 0.55)} C ${P(960, w * 0.4)}, ${P(900, w * 0.1)}, ${P(780, 0)} L ${P(260, 0)} C ${P(120, 0)}, ${P(40, w * 0.1)}, ${P(4, w * 0.35)} Z`;
}

function BrushStroke({
  className,
  width,
  seed,
  dir = "v",
  delay = 0,
  opacity = 0.92,
}: {
  className: string;
  width: number;
  seed: number;
  dir?: Dir;
  delay?: number;
  opacity?: number;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const v = dir === "v";
  return (
    <motion.svg
      aria-hidden
      className={`pointer-events-none absolute z-20 ${className}`}
      viewBox={v ? `0 0 ${width + 20} 1000` : `0 0 1000 ${width + 20}`}
      preserveAspectRatio="none"
      style={v ? { width: width + 20, transformOrigin: "top" } : { height: width + 20, transformOrigin: "left" }}
      initial={reduce ? false : v ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={v ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay }}
    >
      <defs>
        <filter id={`b${id}`} x={v ? "-40%" : "-2%"} y={v ? "-2%" : "-40%"} width={v ? "180%" : "104%"} height={v ? "104%" : "180%"}>
          {/* dry-brush streaks running along the stroke */}
          <feTurbulence type="fractalNoise" baseFrequency={v ? "0.55 0.004" : "0.004 0.55"} numOctaves="2" seed={seed} result="streak" />
          <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.55" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="textured" />
          {/* ragged, wobbly edges */}
          <feTurbulence type="fractalNoise" baseFrequency={v ? "0.06 0.01" : "0.01 0.06"} numOctaves="2" seed={seed + 7} result="edge" />
          <feDisplacementMap in="textured" in2="edge" scale={Math.max(3, width * 0.22)} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path d={strokeOutline(width, dir)} fill="#8b6cff" opacity={opacity} filter={`url(#b${id})`} />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* Film rail: sprocket holes + Kodak-style edge print                  */

function Rail({ dir, side, labels }: { dir: Dir; side: "a" | "b"; labels: string[] }) {
  const v = dir === "v";
  const holes = (
    <div className={`flex justify-between overflow-hidden ${v ? "h-full flex-col py-2" : "w-full px-2"}`}>
      {Array.from({ length: v ? 34 : 70 }, (_, i) => (
        <span
          key={i}
          className={`block shrink-0 rounded-[3px] bg-[#07070a] shadow-[inset_0_0_0_1px_rgba(255,236,210,0.2)] ${v ? "h-[11px] w-[15px]" : "h-[15px] w-[11px]"}`}
        />
      ))}
    </div>
  );
  const ticks = (
    <span
      className={`block opacity-80 ${v ? "h-10 w-[5px]" : "h-[5px] w-10"}`}
      style={{ background: `repeating-linear-gradient(${v ? "to bottom" : "to right"}, ${MAUVE} 0 2px, transparent 2px 5px, ${MAUVE} 5px 6px, transparent 6px 9px)` }}
    />
  );
  const print = (
    <div className={`flex items-center justify-around ${v ? "h-full flex-col py-6" : "w-full px-10"}`} style={{ color: MAUVE }}>
      {labels.map((l, i) => (
        <span key={i} className={`flex items-center gap-3 ${v ? "flex-col" : ""}`}>
          <span
            className={`font-mono text-[9px] font-semibold tracking-[0.25em] ${v ? "[writing-mode:vertical-rl]" : ""}`}
            style={{ transform: v && side === "a" ? "rotate(180deg)" : undefined }}
          >
            TIKOPIX 400 ▸ {l}
          </span>
          {ticks}
        </span>
      ))}
    </div>
  );
  // Edge print always sits between the holes and the frames
  const reverse = side === "b";
  return (
    <div
      aria-hidden
      className={`flex shrink-0 gap-1 ${v ? `w-[42px] px-1.5 sm:w-[46px] ${reverse ? "flex-row-reverse" : ""}` : `h-[44px] flex-col py-1.5 ${reverse ? "flex-col-reverse" : ""}`}`}
    >
      {holes}
      {print}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Frame: an aged black darkroom print holding one step                */

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
const DUST =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='260'><filter id='d'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' seed='5'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 9 -8.4'/></filter><rect width='100%' height='100%' filter='url(%23d)'/><path d='M60 0 L63 260 M171 0 L168 140' stroke='white' stroke-opacity='0.12' stroke-width='0.6'/></svg>\")";

function Frame({ n, step, dir }: { n: number; step: Step; dir: Dir }) {
  return (
    <li
      className={`relative flex flex-col overflow-hidden rounded-[1px] bg-[radial-gradient(ellipse_at_40%_35%,#1d1924_0%,#0e0c11_70%,#08070a_100%)] px-6 pb-7 pt-6 text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] ${
        dir === "h" ? "aspect-[3/2] flex-1 px-9 pt-8" : "sm:aspect-[5/6] sm:px-8 sm:pt-7"
      }`}
    >
      {/* aging: mauve light leak, deep vignette, grain, dust and scratches */}
      <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(139,108,255,0.38),transparent_70%)]" />
      <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.75)]" />
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-screen" style={{ backgroundImage: GRAIN }} />
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-50 mix-blend-screen" style={{ backgroundImage: DUST }} />

      <span className="relative font-display text-[44px] font-semibold leading-none tracking-tight text-violet-soft sm:text-[56px]" style={{ fontStretch: "112%" }}>
        {String(n).padStart(2, "0")}
      </span>
      {/* title + text sit at the foot of the frame, like a caption on a print */}
      <div className="relative mt-6 sm:mt-auto">
        <span aria-hidden className="mb-4 block h-px w-10 bg-violet/70" />
        <h3 className="font-display text-xl font-semibold uppercase tracking-[0.02em]" style={{ fontStretch: "108%" }}>
          {step.t}
        </h3>
        <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-fg/65">{step.d}</p>
      </div>
      <span aria-hidden className="absolute bottom-3 right-4 font-mono text-[9px] tracking-[0.3em] text-violet-soft/40">
        {n}A
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */

function Strip({ steps, start, tilt, delay, dir }: { steps: Step[]; start: number; tilt: number; delay: number; dir: Dir }) {
  const reduce = useReducedMotion();
  const labels = steps.map((_, i) => String(start + i));
  const v = dir === "v";
  return (
    <motion.div
      className={`relative flex ${v ? "" : "flex-col"}`}
      style={{ background: BASE }}
      initial={reduce ? false : v ? { opacity: 0, y: 80, rotate: tilt * 4 } : { opacity: 0, x: tilt < 0 ? -120 : 120, rotate: tilt * 4 }}
      whileInView={v ? { opacity: 1, y: 0, rotate: tilt } : { opacity: 1, x: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      {/* film burn at the ends */}
      <span
        aria-hidden
        className={`pointer-events-none absolute ${v ? "inset-x-0 top-0 h-6 bg-gradient-to-b" : "inset-y-0 left-0 w-8 bg-gradient-to-r"} from-[rgba(139,108,255,0.35)] to-transparent`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute ${v ? "inset-x-0 bottom-0 h-6 bg-gradient-to-t" : "inset-y-0 right-0 w-8 bg-gradient-to-l"} from-[rgba(139,108,255,0.25)] to-transparent`}
      />
      <Rail dir={dir} side="a" labels={labels} />
      <ol className={`flex flex-1 gap-3.5 ${v ? "flex-col py-4" : "flex-row px-4"}`} start={start}>
        {steps.map((s, i) => (
          <Frame key={s.t} n={start + i} step={s} dir={dir} />
        ))}
      </ol>
      <Rail dir={dir} side="b" labels={labels} />
    </motion.div>
  );
}

/**
 * "How I work" as two strips of 35mm film, like a photographer's contact sheet.
 * Desktop: two horizontal strips stacked. Phone/tablet: vertical strips (frames stay readable).
 */
export function FilmSteps({ steps }: { steps: Step[] }) {
  const half = Math.ceil(steps.length / 2);
  const a = steps.slice(0, half);
  const b = steps.slice(half);
  return (
    <>
      {/* Horizontal (lg+) */}
      <div className="relative mx-auto mt-16 hidden max-w-6xl flex-col gap-12 lg:flex">
        <Strip dir="h" steps={a} start={1} tilt={-0.5} delay={0} />
        <Strip dir="h" steps={b} start={half + 1} tilt={0.4} delay={0.15} />
        <BrushStroke dir="h" className="-right-12 bottom-[8px] w-[46%]" width={7} seed={19} delay={1.05} opacity={0.8} />
      </div>

      {/* Vertical (phone / tablet) */}
      <div className="relative mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-8 lg:hidden">
        <Strip dir="v" steps={a} start={1} tilt={-0.6} delay={0} />
        <Strip dir="v" steps={b} start={half + 1} tilt={0.5} delay={0.15} />
        <BrushStroke className="-bottom-12 right-[12px] h-[48%]" width={7} seed={19} delay={1.05} opacity={0.8} />
      </div>
    </>
  );
}
