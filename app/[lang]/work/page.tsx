import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaSection } from "@/components/sections/CtaSection";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategories, getProjects, getSettings } from "@/lib/content";
import { getDict, localizedMeta, pageLang } from "@/lib/page-lang";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const lang = await pageLang(params);
  return localizedMeta(lang, "/work", "Work", getDict(lang).meta.work);
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const lang = await pageLang(params);
  const t = getDict(lang);
  const [projects, categories, s] = await Promise.all([getProjects(lang), getCategories(lang), getSettings(lang)]);
  return (
    <>
      <PageHeader eyebrow={t.work.eyebrow} title="Work" intro={t.work.intro} />
      <Suspense>
        <WorkGrid projects={projects} categories={categories} />
      </Suspense>
      <CtaSection s={s} />
    </>
  );
}
