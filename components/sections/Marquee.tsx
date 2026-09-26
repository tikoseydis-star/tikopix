"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { useRef } from "react";

/** Endless ribbon of words whose speed and direction react to scroll velocity. */
export function Marquee({ items, baseVelocity = -2.2 }: { items: string[]; baseVelocity?: number }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    base.set(base.get() + move);
  });

  const row = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line py-6" aria-hidden>
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className={`h-display px-8 text-[clamp(2rem,5vw,4.5rem)] ${i % 2 ? "text-transparent [-webkit-text-stroke:1px_rgba(200,203,212,0.55)]" : "text-fg"}`}>{w}</span>
                <span className="h-2.5 w-2.5 rotate-45 bg-violet" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
