"use client";

import { motion } from "motion/react";

export function FilterChips({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`relative shrink-0 rounded-full border px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors ${
              active ? "border-violet text-fg" : "border-line-strong text-muted hover:border-fg/40 hover:text-fg"
            }`}
          >
            {active && <motion.span layoutId={`chip-${label}`} className="absolute inset-0 rounded-full bg-violet/25" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
            <span className="relative">
              {o.label}
              {o.count !== undefined && <span className="ml-2 text-[10px] text-muted">{o.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
