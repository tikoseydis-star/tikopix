"use client";

import { useEffect, useRef, useState } from "react";

type Pt = { x: number; y: number; t: number };

const LIFE = 520; // ms a brush point stays visible
const MAX_W = 9; // px, stroke width at full speed

/**
 * Cursor = a precise dot glued to the pointer (no lag) + a violet brush stroke
 * painted on a canvas that tapers and fades behind it. Hovering a link or a
 * [data-cursor="Label"] element grows the dot into a labelled pill.
 * Fine pointers only; disabled for reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

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
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dot = dotRef.current!;
    const pts: Pt[] = [];
    let raf = 0;
    let dirty = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      dot.style.opacity = "1";
      // Coalesced events give every intermediate position → a smooth stroke even on fast moves
      const events = e.getCoalescedEvents?.() ?? [e];
      const now = performance.now();
      for (const ev of events.length ? events : [e]) pts.push({ x: ev.clientX, y: ev.clientY, t: now });
      dirty = true;

      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role=button], input, textarea, select, label");
      setLabel(t?.dataset.cursor ?? null);
      setHover(!!t);
    };
    const leave = () => { dot.style.opacity = "0"; };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      if (!pts.length && !dirty) return;
      dirty = pts.length > 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (pts.length < 2) return;

      // Build one continuous ribbon (no overlapping segments → no "beads"):
      // width follows speed and tapers toward the tail, filled with a head→tail fade.
      const n = pts.length;
      const L: [number, number][] = [];
      const R: [number, number][] = [];
      let v = 0;
      for (let i = 0; i < n; i++) {
        const p = pts[i];
        const prev = pts[Math.max(i - 1, 0)];
        const next = pts[Math.min(i + 1, n - 1)];
        v = v * 0.7 + Math.min(Math.hypot(p.x - prev.x, p.y - prev.y) / 14, 1) * 0.3;
        const life = 1 - (now - p.t) / LIFE;
        const taper = i / (n - 1);
        const w = (1.2 + v * MAX_W) * life * (0.25 + 0.75 * taper);
        let dx = next.x - prev.x;
        let dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        L.push([p.x - dy * w, p.y + dx * w]);
        R.push([p.x + dy * w, p.y - dx * w]);
      }
      const trace = (side: [number, number][], reverse: boolean) => {
        const list = reverse ? [...side].reverse() : side;
        for (let i = 1; i < list.length - 1; i++) {
          const mx = (list[i][0] + list[i + 1][0]) / 2;
          const my = (list[i][1] + list[i + 1][1]) / 2;
          ctx.quadraticCurveTo(list[i][0], list[i][1], mx, my);
        }
        ctx.lineTo(list[list.length - 1][0], list[list.length - 1][1]);
      };
      const head = pts[n - 1];
      const tail = pts[0];
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      grad.addColorStop(0, "rgba(139, 108, 255, 0)");
      grad.addColorStop(0.6, "rgba(139, 108, 255, 0.55)");
      grad.addColorStop(1, "rgba(200, 180, 255, 0.95)");

      ctx.beginPath();
      ctx.moveTo(L[0][0], L[0][1]);
      trace(L, false);
      ctx.lineTo(R[n - 1][0], R[n - 1][1]);
      trace(R, true);
      ctx.closePath();
      ctx.shadowColor = "rgba(139, 108, 255, 0.8)";
      ctx.shadowBlur = 16;
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div ref={dotRef} className="fixed left-0 top-0 opacity-0 will-change-transform">
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,box-shadow] duration-300 ease-[var(--ease-out)] ${
            label
              ? "h-20 w-20 bg-violet shadow-[0_0_40px_rgba(139,108,255,0.55)]"
              : hover
                ? "h-10 w-10 bg-violet/25 shadow-[0_0_0_1px_rgba(185,166,255,0.8)]"
                : "h-2.5 w-2.5 bg-white shadow-[0_0_12px_rgba(185,166,255,0.9)]"
          }`}
        >
          {label && <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">{label}</span>}
        </div>
      </div>
    </div>
  );
}
