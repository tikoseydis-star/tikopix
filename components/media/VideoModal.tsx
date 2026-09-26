"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/types";
import { useDict } from "@/components/i18n";

type Ctx = { open: (v: Video, title?: string) => void };
const VideoCtx = createContext<Ctx>({ open: () => {} });
export const useVideoModal = () => useContext(VideoCtx);

/** Converts a YouTube / Vimeo share link into an autoplaying embed URL. */
export function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).find((p) => /^\d+$/.test(p));
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` : null;
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

export function VideoModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ video: Video; title?: string } | null>(null);
  const t = useDict();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((video: Video, title?: string) => {
    returnFocus.current = document.activeElement as HTMLElement;
    setState({ video, title });
  }, []);
  const close = useCallback(() => {
    setState(null);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!state) return;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [state, close]);

  const embed = state?.video.url ? embedUrl(state.video.url) : null;

  return (
    <VideoCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={state.title ?? t.work.video}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t.video.close}
              data-cursor={t.cursor.close}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:bg-violet sm:right-8 sm:top-8"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg bg-black"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {embed ? (
                <iframe
                  src={embed}
                  title={state.title ?? t.work.video}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : state.video.file ? (
                <video src={state.video.file} poster={state.video.poster?.src} className="absolute inset-0 h-full w-full" controls autoPlay playsInline />
              ) : (
                <p className="absolute inset-0 flex items-center justify-center text-muted">{t.video.unavailable}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </VideoCtx.Provider>
  );
}
