import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { sanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#0a0a0d", color: "#f4f4f6", fontFamily: "system-ui", padding: 24 }}>
        <div style={{ maxWidth: 560, lineHeight: 1.6 }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>TikoPix Studio</h1>
          <p>Le Studio n&apos;est pas encore connecté. Pour l&apos;activer :</p>
          <ol style={{ paddingLeft: 20, marginTop: 12 }}>
            <li>Crée un projet gratuit sur <a href="https://www.sanity.io/manage" style={{ color: "#b9a6ff" }}>sanity.io/manage</a></li>
            <li>Copie le <b>Project ID</b> dans <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (.env.local et Vercel)</li>
            <li>Dans l&apos;onglet API → CORS origins, ajoute l&apos;adresse du site (ex. http://localhost:3010)</li>
            <li>Redémarre le site, puis reviens sur /studio</li>
          </ol>
        </div>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
