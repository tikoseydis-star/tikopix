import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaSection } from "@/components/sections/CtaSection";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategories, getProjects, getSettings } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Work", description: "Projets photo et vidéo : sport, lifestyle, immobilier, événements." };

export default async function WorkPage() {
  const [projects, categories, s] = await Promise.all([getProjects(), getCategories(), getSettings()]);
  return (
    <>
      <PageHeader eyebrow="Projets" title="Work" intro="Une sélection de projets. Peu de mots, beaucoup d'images." />
      <Suspense>
        <WorkGrid projects={projects} categories={categories} />
      </Suspense>
      <CtaSection s={s} />
    </>
  );
}
