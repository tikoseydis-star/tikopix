"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

/** 3D perspective tilt that follows the pointer, with a moving glare highlight. */
export function TiltCard({ children, className = "", max = 9 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 55%)`;

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          ry.set((nx - 0.5) * max * 2);
          rx.set((0.5 - ny) * max * 2);
          gx.set(nx * 100);
          gy.set(ny * 100);
        }}
        onPointerLeave={() => { rx.set(0); ry.set(0); }}
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [.group:hover_&]:opacity-100" style={{ background: glare }} />
      </motion.div>
    </div>
  );
}
