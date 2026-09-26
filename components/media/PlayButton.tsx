"use client";

import { Play } from "lucide-react";
import type { Video } from "@/lib/types";
import { useVideoModal } from "./VideoModal";
import { useDict } from "@/components/i18n";

export function PlayButton({ video, label, title, className = "" }: { video: Video; label: string; title?: string; className?: string }) {
  const { open } = useVideoModal();
  const t = useDict();
  return (
    <button type="button" onClick={() => open(video, title)} data-cursor={t.cursor.play} className={`group inline-flex items-center gap-4 text-sm font-medium text-fg ${className}`}>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-fg/80 transition-all duration-500 group-hover:scale-110 group-hover:border-violet group-hover:bg-violet">
        <span className="absolute inset-0 animate-ping rounded-full border border-violet/40 [animation-duration:2.4s]" aria-hidden />
        <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
      </span>
      {label}
    </button>
  );
}
