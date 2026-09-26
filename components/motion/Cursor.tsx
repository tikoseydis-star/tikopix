"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Two-part cursor (dot + trailing ring). Elements with data-cursor="Label"
 * grow the ring and show the label ("Voir", "Play"…). Fine pointers only.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 300, damping: 30, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // Browser-only capability check; must run after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role=button], input, textarea, select");
      setLabel(t?.dataset.cursor ?? null);
      setHover(!!t);
    };
    const leave = () => { x.set(-100); y.set(-100); };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 88 : hover ? 44 : 28;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference" style={{ x, y }} />
      <motion.div
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-white/60"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          backgroundColor: label ? "rgba(139,108,255,0.92)" : "rgba(139,108,255,0)",
          borderColor: label ? "rgba(139,108,255,0)" : "rgba(255,255,255,0.55)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
