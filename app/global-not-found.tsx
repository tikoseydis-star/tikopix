import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { title: "404 · TikoPix" };

/** Unmatched URLs (language redirects in next.config.ts route everything else into /fr or /en). */
export default function GlobalNotFound() {
  return (
    <html lang="fr-CA" className={fontVariables}>
      <body>
        <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
          <p className="eyebrow">404</p>
          <h1 className="h-display text-[clamp(3rem,12vw,9rem)]">
            Hors <span className="script normal-case">champ</span>
          </h1>
          <p className="max-w-sm text-muted">Page introuvable · Page not found</p>
          <div className="flex gap-3">
            <Link href="/fr" className="btn-ghost">Accueil</Link>
            <Link href="/en" className="btn-ghost">Home</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
