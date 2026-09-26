"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import { type ComponentProps, forwardRef } from "react";
import { defaultLocale, getDict, isLocale, localePath, type Locale } from "@/lib/i18n";

export function useLang(): Locale {
  const { lang } = useParams<{ lang?: string }>();
  return isLocale(lang) ? lang : defaultLocale;
}

export function useDict() {
  return getDict(useLang());
}

/** next/link that keeps the visitor in their language: href="/work" → "/en/work". */
export const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(function LocaleLink({ href, ...rest }, ref) {
  const lang = useLang();
  const target = typeof href === "string" ? localePath(lang, href) : href;
  return <NextLink ref={ref} href={target} {...rest} />;
});
