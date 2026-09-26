"use client";

import { Link, useDict } from "@/components/i18n";

export default function NotFound() {
  const t = useDict().notFound;
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="h-display text-[clamp(3rem,12vw,9rem)]">
        {t.title} <span className="script normal-case">{t.accent}</span>
      </h1>
      <p className="max-w-sm text-muted">{t.text}</p>
      <Link href="/" className="btn-ghost">{t.back}</Link>
    </div>
  );
}
