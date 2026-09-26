import type { Metadata } from "next";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategories, getPhotoStream } from "@/lib/content";
import { getDict, localizedMeta, pageLang } from "@/lib/page-lang";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/photo">): Promise<Metadata> {
  const lang = await pageLang(params);
  return localizedMeta(lang, "/photo", "Photo", getDict(lang).meta.photo);
}

export default async function PhotoPage({ params }: PageProps<"/[lang]/photo">) {
  const lang = await pageLang(params);
  const t = getDict(lang);
  const [items, categories] = await Promise.all([getPhotoStream(lang), getCategories(lang)]);
  return (
    <>
      <PageHeader eyebrow={t.photo.eyebrow} title="Photo" intro={t.photo.intro} />
      <PhotoGallery items={items} categories={categories} />
    </>
  );
}
