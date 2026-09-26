"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Link, useDict } from "@/components/i18n";
import { useCallback, useEffect, useRef } from "react";
import type { Img, Project } from "@/lib/types";

type Item = { image: Img; project: Project };

export function Lightbox({ items, index, onChange }: { items: Item[]; index: number | null; onChange: (i: number | null) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = useDict();
  const item = index !== null ? items[index] : null;
  const go = useCallback((d: number) => index !== null && onChange((index + d + items.length) % items.length), [index, items.length, onChange]);

  useEffect(() => {
    if (index === null) return;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [index, go, onChange]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.image.alt}
          className="fixed inset-0 z-[80] flex flex-col bg-black/95 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between p-4 sm:p-6">
            <p className="text-xs text-muted tabular-nums">
              {index! + 1} / {items.length}
            </p>
            <button ref={closeRef} type="button" onClick={() => onChange(null)} aria-label={t.photo.close} className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong hover:bg-violet">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.image.src + index}
                className="absolute inset-0 px-4 sm:px-20"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              >
                <div className="relative h-full w-full">
                  <Image src={item.image.src} alt={item.image.alt} fill sizes="100vw" quality={85} className="object-contain" draggable={false} />
                </div>
              </motion.div>
            </AnimatePresence>
            <button type="button" onClick={() => go(-1)} aria-label={t.photo.prev} className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong hover:bg-violet sm:flex">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.photo.next} className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong hover:bg-violet sm:flex">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 text-xs sm:p-6">
            <p className="text-muted">
              <span className="text-fg">{item.project.title}</span> · {item.project.category.title}
            </p>
            <Link href={`/work/${item.project.slug}`} onClick={() => onChange(null)} className="text-violet-soft hover:text-fg">
              {t.photo.seeProject}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
