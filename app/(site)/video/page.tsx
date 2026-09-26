import type { Metadata } from "next";
import { ReelZoom } from "@/components/sections/ReelZoom";
import { VideoList } from "@/components/sections/VideoList";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProjects, getSettings } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Video", description: "Showreel et vidéos cinématiques, montage et colorimétrie sur DaVinci Resolve." };

export default async function VideoPage() {
  const [projects, s] = await Promise.all([getProjects(), getSettings()]);
  const withVideo = projects.filter((p) => p.video);
  return (
    <>
      <PageHeader eyebrow="Mouvement" title="Video" intro="Tournage, montage et colorimétrie. Survole pour un aperçu, clique pour le son." />
      {s.showreel && <ReelZoom reel={s.showreel} year={String(new Date().getFullYear())} />}
      <VideoList projects={withVideo} />
    </>
  );
}
