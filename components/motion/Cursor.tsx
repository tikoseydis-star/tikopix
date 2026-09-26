"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "idle" | "link" | "label";

/**
 * TikoPix cursor: a glowing violet point inside the logo's viewfinder corners (⌜ ⌟),
 * like a camera autofocus frame. Glued to the pointer (no easing on position, so it
 * never lags); only the frame's size animates:
 *   - links/buttons → the frame opens and "locks focus"
 *   - [data-cursor="Label"] (photos, videos) → larger frame with the label
 *   - mouse down → the frame snaps shut like a shutter
 * Fine pointers only; disabled for reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only capability check after mount
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current!;
    let x = -100;
    let y = -100;
    let frame = 0;
    let lastTarget: Element | null = null;

    // Position is written once per frame, straight from the latest pointer event:
    // no spring, no lag, and never more than one style write per frame.
    const paint = () => {
      frame = 0;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
      setVisible(true);

      if (e.target === lastTarget) return;
      lastTarget = e.target as Element;
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, [role=button], input, textarea, select, label, summary",
      );
      const text = t?.dataset.cursor ?? null;
      setLabel(text);
      setMode(text ? "label" : t ? "link" : "idle");
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  // Frame size (px) per state; pressing snaps it shut like a shutter
  const size = pressed ? 14 : mode === "label" ? 84 : mode === "link" ? 40 : 24;
  const corner = mode === "label" ? 14 : 8;
  const color = mode === "idle" ? "rgba(244,244,246,0.9)" : "#b9a6ff";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
      style={{ transform: "translate3d(-100px,-100px,0)", opacity: visible ? 1 : 0, transition: "opacity 200ms" }}
    >
      {/* Autofocus frame: only its size animates, the position never lags */}
      <div
        className="absolute left-0 top-0"
        style={{
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
          transition: "width 260ms cubic-bezier(0.22,1,0.36,1), height 260ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <span
            key={c}
            className="absolute"
            style={{
              width: corner,
              height: corner,
              top: c[0] === "t" ? 0 : undefined,
              bottom: c[0] === "b" ? 0 : undefined,
              left: c[1] === "l" ? 0 : undefined,
              right: c[1] === "r" ? 0 : undefined,
              borderColor: color,
              borderStyle: "solid",
              borderWidth: `${c[0] === "t" ? 1.5 : 0}px ${c[1] === "r" ? 1.5 : 0}px ${c[0] === "b" ? 1.5 : 0}px ${c[1] === "l" ? 1.5 : 0}px`,
              filter: mode === "idle" ? "none" : "drop-shadow(0 0 4px rgba(139,108,255,0.9))",
              transition: "width 260ms, height 260ms, border-color 200ms, filter 200ms",
            }}
          />
        ))}
        {label && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.24em] text-white [text-shadow:0_0_10px_rgba(139,108,255,0.9)]">
            {label}
          </span>
        )}
      </div>

      {/* The light: a small glowing point with a soft violet bloom */}
      <div
        className="absolute left-0 top-0 rounded-full"
        style={{
          // Over a link the light shrinks so it never hides the text being pointed at
          width: mode === "label" ? 0 : mode === "link" ? 3 : 6,
          height: mode === "label" ? 0 : mode === "link" ? 3 : 6,
          transform: "translate(-50%, -50%)",
          background: "#fff",
          boxShadow:
            mode === "link"
              ? "0 0 4px 1px rgba(185,166,255,0.8)"
              : "0 0 6px 2px rgba(185,166,255,0.95), 0 0 18px 6px rgba(139,108,255,0.55), 0 0 42px 14px rgba(139,108,255,0.22)",
          transition: "width 200ms, height 200ms, box-shadow 200ms",
        }}
      />
    </div>
  );
}
