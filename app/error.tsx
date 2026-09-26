"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <p className="eyebrow">Oups</p>
      <h1 className="h-display text-4xl">Surexposé.</h1>
      <p className="max-w-sm text-muted">Quelque chose s&apos;est mal passé. Réessaie dans un instant.</p>
      <button type="button" onClick={reset} className="btn-ghost">Réessayer</button>
    </main>
  );
}
