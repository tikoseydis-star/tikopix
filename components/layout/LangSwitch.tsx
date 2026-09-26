"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDict, useLang } from "@/components/i18n";
import { locales } from "@/lib/i18n";

/** Strips the locale prefix: "/en/work/x" → "/work/x". */
export function stripLocale(pathname: string) {
  return pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
}

function Switch({ className }: { className: string }) {
  const lang = useLang();
  const t = useDict();
  const path = stripLocale(usePathname());
  const qs = useSearchParams().toString();

  return (
    <div role="group" aria-label={t.a11y.language} className={`flex items-center gap-1 text-[11px] font-medium tracking-[0.18em] ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-fg/30" aria-hidden>/</span>}
          <NextLink
            href={`/${l}${path === "/" ? "" : path}${qs ? `?${qs}` : ""}`}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            // Remember the choice so the language redirects in next.config.ts honour it next visit
            onClick={() => { document.cookie = `tikopix-lang=${l};path=/;max-age=31536000;samesite=lax`; }}
            className={`px-1 py-1 uppercase transition-colors ${l === lang ? "text-fg" : "text-fg/45 hover:text-violet-soft"}`}
          >
            {l}
          </NextLink>
        </span>
      ))}
    </div>
  );
}

export function LangSwitch({ className = "" }: { className?: string }) {
  return (
    <Suspense fallback={<div className={className} />}>
      <Switch className={className} />
    </Suspense>
  );
}
