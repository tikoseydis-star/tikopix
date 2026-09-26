import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale, type Locale } from "./i18n";

/** Resolves and validates the [lang] param for a page. */
export async function pageLang(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

/** Title/description + canonical and hreflang alternates for a localized path ("" = home). */
export function localizedMeta(lang: Locale, path: string, title: string | undefined, description: string): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { "fr-CA": `/fr${path}`, "en-CA": `/en${path}` },
    },
  };
}

export { getDict };
