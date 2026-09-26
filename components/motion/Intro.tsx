"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";

const KEY = "tikopix-intro-seen";

/** 9-blade aperture drawn as the hole of an SVG mask. */
function irisPath(open: number) {
  // open 0 → closed pinhole, 1 → wider than the screen
  const blades = 9;
  const r = 2 + open * 160;
  const pts: string[] = [];
  for (let i = 0; i < blades; i++) {
    const a = (i / blades) * Math.PI * 2;
    pts.push(`${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`);
  }
  return `M${pts.join(" L")} Z`;
}

/**
 * Once-per-session loader: a camera iris opens on the site while a counter runs,
 * like a shutter taking the first frame. Skipped for reduced motion.
 */
export function Intro({ name }: { name: string }) {
  // Rendered from the first paint (SSR) so the page never flashes before the shutter;
  // an inline script in the root layout hides it instantly for returning visitors.
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);
  const open = useMotionValue(0);
  const spin = useTransform(open, [0, 1], [0, 140]);
  const d = useTransform(open, irisPath);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch { /* storage blocked */ }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is browser-only
      setShow(false);
      return;
    }
    document.documentElement.style.overflow = "hidden";

    const counter = animate(0, 100, { duration: 1.5, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setCount(Math.round(v)) });
    const iris = animate(open, 1, { delay: 1.55, duration: 1.3, ease: [0.76, 0, 0.24, 1] });
    iris.then(() => {
      try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ }
      document.documentElement.style.overflow = "";
      setShow(false);
    });
    return () => { counter.stop(); iris.stop(); document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro-overlay fixed inset-0 z-[90]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="iris-mask">
                <rect width="100" height="100" fill="white" />
                <motion.path d={d} fill="black" style={{ rotate: spin, transformOrigin: "50px 50px" }} />
              </mask>
            </defs>
            <rect width="100" height="100" fill="#0a0a0d" mask="url(#iris-mask)" />
          </svg>
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            animate={{ opacity: count >= 100 ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="h-display text-2xl tracking-[0.5em] text-fg">{name}</span>
            <span className="font-display text-sm tabular-nums tracking-[0.3em] text-violet-soft">
              f/{(16 - (count / 100) * 14.6).toFixed(1)} · {String(count).padStart(3, "0")}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
