import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="h-display text-[clamp(3rem,12vw,9rem)]">
        Hors <span className="script normal-case">champ</span>
      </h1>
      <p className="max-w-sm text-muted">Cette page n&apos;est pas dans le cadre. Retournons à l&apos;essentiel.</p>
      <Link href="/" className="btn-ghost">Retour à l&apos;accueil</Link>
    </main>
  );
}
