"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ClipReveal } from "@/components/motion/Reveal";
import type { Project } from "@/lib/types";

/** Featured-project tile: clip-path reveal, inner parallax, hover zoom, caption like the mockup. */
export function ProjectCard({ p, delay = 0, aspect = "aspect-[16/10]", sizes = "(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" }: { p: Project; delay?: number; aspect?: string; sizes?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <Link ref={ref} href={`/work/${p.slug}`} className="group block" data-cursor="Voir">
      <ClipReveal delay={delay} className={`relative overflow-hidden rounded-sm bg-surface ${aspect}`}>
        <motion.div className="absolute inset-[-10%]" style={{ y }}>
          <Image
            src={p.cover.src}
            alt={p.cover.alt}
            fill
            sizes={sizes}
            placeholder={p.cover.lqip ? "blur" : "empty"}
            blurDataURL={p.cover.lqip}
            className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.08]"
            style={{ objectPosition: p.cover.position }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/20" />
        {p.video && (
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur">Vidéo</span>
        )}
      </ClipReveal>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow !text-[10px]">{p.eyebrow || p.category.title}</p>
          <h3 className="mt-1.5 text-[15px] font-medium text-fg">{p.title}</h3>
          <p className="mt-1 text-xs text-muted">{p.services}</p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-all duration-500 group-hover:translate-x-1 group-hover:text-violet-soft" strokeWidth={1.5} />
      </div>
    </Link>
  );
}
