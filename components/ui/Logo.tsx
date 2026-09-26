"use client";

import { Link, useDict } from "@/components/i18n";

/** "TIKOPIX" wordmark framed by viewfinder corner brackets, as in the brand mockup. */
export function Logo({ className = "", name = "TikoPix" }: { className?: string; name?: string }) {
  const t = useDict();
  return (
    <Link href="/" aria-label={`${name}, ${t.a11y.home}`} className={`group relative inline-block px-2.5 py-1.5 ${className}`}>
      <span aria-hidden className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-fg transition-all duration-500 group-hover:h-3.5 group-hover:w-3.5 group-hover:border-violet" />
      <span aria-hidden className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-fg transition-all duration-500 group-hover:h-3.5 group-hover:w-3.5 group-hover:border-violet" />
      <span className="font-display text-[19px] font-medium uppercase tracking-[0.28em] text-fg" style={{ fontStretch: "115%" }}>
        {name}
      </span>
    </Link>
  );
}
