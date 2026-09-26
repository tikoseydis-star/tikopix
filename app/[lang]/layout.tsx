import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { VideoModalProvider } from "@/components/media/VideoModal";
import { Cursor } from "@/components/motion/Cursor";
import { Intro } from "@/components/motion/Intro";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { getSettings } from "@/lib/content";
import { getDict, isLocale, locales } from "@/lib/i18n";
import { jsonLdString, siteJsonLd } from "@/lib/structured-data";
import { fontVariables } from "../fonts";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tikopix.com";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDict(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.title, template: "%s · TikoPix" },
    description: t.meta.description,
    openGraph: {
      type: "website",
      siteName: "TikoPix",
      locale: lang === "fr" ? "fr_CA" : "en_CA",
      images: [{ url: "/og-tikopix.jpg", width: 1200, height: 630, alt: t.meta.title }],
    },
    twitter: { card: "summary_large_image", images: ["/og-tikopix.jpg"] },
    alternates: { canonical: `/${lang}`, languages: { "fr-CA": "/fr", "en-CA": "/en" } },
  };
}

export const viewport: Viewport = { themeColor: "#0a0a0d" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const settings = await getSettings(lang);
  const t = getDict(lang);

  return (
    <html lang={lang === "fr" ? "fr-CA" : "en-CA"} suppressHydrationWarning className={fontVariables}>
      <head>
        <script
          // Skip the intro shutter instantly for returning visitors / reduced motion (runs before paint)
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("tikopix-intro-seen")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh">
        <SmoothScroll>
          <VideoModalProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-violet focus:px-4 focus:py-2">
              {t.a11y.skip}
            </a>
            <Intro name={settings.name} />
            <Header name={settings.name} instagram={settings.instagram} youtube={settings.youtube} email={settings.email} />
            <main id="main">{children}</main>
            <Footer settings={settings} lang={lang} />
            <Cursor />
          </VideoModalProvider>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(siteJsonLd(lang, settings, t.meta.description)) }} />
        </SmoothScroll>
      </body>
    </html>
  );
}
