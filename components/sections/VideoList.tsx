"use client";

import { Play } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Link, useDict } from "@/components/i18n";
import { useRef } from "react";
import { useVideoModal } from "@/components/media/VideoModal";
import type { Project } from "@/lib/types";

/** Big cinematic rows; a hovered row previews its clip muted, click plays it with sound. */
function VideoRow({ p, index }: { p: Project; index: number }) {
  const { open } = useVideoModal();
  const vid = useRef<HTMLVideoElement>(null);
  const t = useDict();
  const video = p.video!;

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-line py-8 md:py-10"
    >
      <div className="grid items-center gap-6 md:grid-cols-[80px_1fr_1.6fr] md:gap-10">
        <span className="font-display text-sm tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <p className="eyebrow !text-[10px]">{p.eyebrow || p.category.title}</p>
          <h2 className="h-display mt-3 text-[clamp(1.8rem,4vw,3.4rem)]">{p.title}</h2>
          <p className="mt-3 text-sm text-muted">{p.summary}</p>
          <Link href={`/work/${p.slug}`} className="mt-5 inline-block text-xs text-violet-soft hover:text-fg">
            {t.photo.seeProject}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => open(video, p.title)}
          onMouseEnter={() => vid.current?.play().catch(() => {})}
          onMouseLeave={() => { if (vid.current) { vid.current.pause(); vid.current.currentTime = 0; } }}
          data-cursor={t.cursor.play}
          aria-label={`${t.video.play} ${p.title}`}
          className="group relative aspect-video overflow-hidden rounded-sm bg-surface"
        >
          <Image src={p.cover.src} alt={p.cover.alt} fill sizes="(min-width:768px) 55vw, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" style={{ objectPosition: p.cover.position }} />
          {video.file && (
            <video ref={vid} src={video.file} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" aria-hidden />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/80 bg-black/30 backdrop-blur transition-all duration-500 group-hover:scale-110 group-hover:border-violet group-hover:bg-violet">
              <Play className="ml-1 h-6 w-6 fill-current" aria-hidden />
            </span>
          </span>
        </button>
      </div>
    </motion.li>
  );
}

export function VideoList({ projects }: { projects: Project[] }) {
  const t = useDict();
  if (!projects.length) return <p className="container-x py-24 text-center text-muted">{t.video.soon}</p>;
  return (
    <ul className="container-x pb-28">
      {projects.map((p, i) => (
        <VideoRow key={p.slug} p={p} index={i} />
      ))}
    </ul>
  );
}
