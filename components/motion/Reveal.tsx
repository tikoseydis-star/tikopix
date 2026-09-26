"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades + lifts its children the first time they enter the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Headline whose lines slide up from behind a mask. Pass one string per line. */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h2",
  animateOnMount = false,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = MOTION_TAGS[Tag];
  // The in-view trigger sits on the visible wrapper: the masked lines themselves start
  // clipped by overflow:hidden, so an observer on them would never fire.
  const trigger = animateOnMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-8% 0px" } };
  return (
    <MotionTag className={className} initial={reduce ? false : "hidden"} {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="-my-[0.14em] block overflow-hidden py-[0.14em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            variants={{ hidden: { y: "135%" }, show: { y: "0%" } }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

const MOTION_TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };

/** Image frame that "develops" open with a clip-path wipe on enter. */
export function ClipReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: "inset(18% 12% 18% 12%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
