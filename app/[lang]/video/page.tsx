import type { Metadata } from "next";
import { ReelZoom } from "@/components/sections/ReelZoom";
import { VideoList } from "@/components/sections/VideoList";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProjects, getSettings } from "@/lib/content";
import { getDict, localizedMeta, pageLang } from "@/lib/page-lang";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/video">): Promise<Metadata> {
  const lang = await pageLang(params);
  return localizedMeta(lang, "/video", getDict(lang).pages.video, getDict(lang).meta.video);
}

export default async function VideoPage({ params }: PageProps<"/[lang]/video">) {
  const lang = await pageLang(params);
  const t = getDict(lang);
  const [projects, s] = await Promise.all([getProjects(lang), getSettings(lang)]);
  const withVideo = projects.filter((p) => p.video);
  return (
    <>
      <PageHeader eyebrow={t.video.eyebrow} title={t.pages.video} intro={t.video.intro} />
      {s.showreel && <ReelZoom reel={s.showreel} year={String(new Date().getFullYear())} />}
      <VideoList projects={withVideo} />
    </>
  );
}
