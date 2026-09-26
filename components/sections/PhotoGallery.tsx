"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/media/Lightbox";
import { FilterChips } from "@/components/ui/FilterChips";
import { useDict } from "@/components/i18n";
import type { Category, Img, Project } from "@/lib/types";

type Item = { image: Img; project: Project };

/** Masonry wall of every photo; images develop in as they scroll into view; click → lightbox. */
export function PhotoGallery({ items, categories }: { items: Item[]; categories: Category[] }) {
  const t = useDict();
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const visible = cat === "all" ? items : items.filter((i) => i.project.category.slug === cat);

  return (
    <section className="container-x pb-28" aria-label={t.photo.eyebrow}>
      <div className="mb-10">
        <FilterChips
          label={t.photo.filter}
          value={cat}
          onChange={setCat}
          options={[{ value: "all", label: t.work.all }, ...categories.map((c) => ({ value: c.slug, label: c.title }))]}
        />
      </div>

      {visible.length === 0 ? (
        <p className="py-24 text-center text-muted">{t.photo.empty}</p>
      ) : (
        <div key={cat} className="columns-2 gap-3 sm:gap-5 lg:columns-3">
          {visible.map((it, i) => (
            <motion.button
              key={it.image.src + i}
              type="button"
              onClick={() => setOpen(i)}
              data-cursor={t.cursor.view}
              aria-label={`${t.photo.enlarge} : ${it.image.alt}`}
              className="group relative mb-3 block w-full overflow-hidden rounded-sm bg-surface sm:mb-5"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.08 }}
            >
              <Image
                src={it.image.src}
                alt={it.image.alt}
                width={it.image.width}
                height={it.image.height}
                sizes="(min-width:1024px) 33vw, 50vw"
                placeholder={it.image.lqip ? "blur" : "empty"}
                blurDataURL={it.image.lqip}
                className="h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-xs transition-transform duration-500 group-hover:translate-y-0">
                {it.project.title}
              </span>
            </motion.button>
          ))}
        </div>
      )}
      <Lightbox items={visible} index={open} onChange={setOpen} />
    </section>
  );
}
