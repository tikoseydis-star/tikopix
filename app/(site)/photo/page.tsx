import type { Metadata } from "next";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategories, getPhotoStream } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Photo", description: "Galerie photo : sport, lifestyle, immobilier et événements à Montréal." };

export default async function PhotoPage() {
  const [items, categories] = await Promise.all([getPhotoStream(), getCategories()]);
  return (
    <>
      <PageHeader eyebrow="Galerie" title="Photo" intro="La lumière, le geste, l'instant. Clique sur une image pour l'agrandir." />
      <PhotoGallery items={items} categories={categories} />
    </>
  );
}
