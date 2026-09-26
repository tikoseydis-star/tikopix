import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Mrs_Saint_Delafield, Permanent_Marker } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker", display: "swap" });
const sign = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-sign", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tikopix.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "TikoPix · Photographe & vidéaste à Montréal", template: "%s · TikoPix" },
  description:
    "Visual stories, captured with intention. Photographie et vidéo à Montréal : sport, lifestyle, immobilier et événements.",
  openGraph: { type: "website", siteName: "TikoPix", locale: "fr_CA" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0a0a0d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA" suppressHydrationWarning className={`${inter.variable} ${archivo.variable} ${marker.variable} ${sign.variable}`}>
      <head>
        <script
          // Skip the intro shutter instantly for returning visitors / reduced motion (runs before paint)
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("tikopix-intro-seen")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
