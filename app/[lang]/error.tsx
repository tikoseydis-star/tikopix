"use client";

import { useEffect } from "react";
import { useDict } from "@/components/i18n";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useDict().error;
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="h-display text-4xl">{t.title}</h1>
      <p className="max-w-sm text-muted">{t.text}</p>
      <button type="button" onClick={reset} className="btn-ghost">{t.retry}</button>
    </div>
  );
}
