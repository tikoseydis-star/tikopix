"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { isActive, NAV } from "./nav";

type Props = { name: string; instagram?: string; youtube?: string; email: string };

export function Header({ name, instagram, youtube, email }: Props) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 200 && y > prev && !open);
  });

  // Close the mobile menu when the route changes
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`transition-[background-color,backdrop-filter,border-color] duration-500 ${
            solid || open ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent"
          }`}
        >
          <div className="container-x flex h-[72px] items-center justify-between gap-6">
            <Logo name={name} />

            <nav aria-label="Navigation principale" className="hidden lg:block">
              <ul className="flex items-center gap-10">
                {NAV.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`group relative py-2 text-[13px] transition-colors ${active ? "text-fg" : "text-fg/75 hover:text-fg"}`}
                      >
                        {item.label}
                        <span
                          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-violet transition-transform duration-500 ${
                            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-5">
              <div className="hidden items-center gap-4 sm:flex">
                {instagram && (
                  <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-fg/80 transition-colors hover:text-violet-soft">
                    <InstagramIcon />
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-fg/80 transition-colors hover:text-violet-soft">
                    <YoutubeIcon />
                  </a>
                )}
              </div>
              <Magnetic className="hidden md:inline-block">
                <Link href="/contact" className="btn-ghost !px-5 !py-2.5 !text-[13px]">
                  Let&apos;s work together
                </Link>
              </Magnetic>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line-strong lg:hidden"
              >
                <span className={`absolute h-px w-5 bg-fg transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
                <span className={`absolute h-px w-5 bg-fg transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Navigation mobile">
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                      <Link
                        href={item.href}
                        className={`h-display block py-1 text-5xl ${isActive(pathname, item.href) ? "text-violet" : "text-fg"}`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="space-y-5">
              <Link href="/contact" className="btn-ghost">Let&apos;s work together</Link>
              <div className="flex items-center gap-5 text-sm text-muted">
                <a href={`mailto:${email}`} className="hover:text-fg">{email}</a>
                {instagram && <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-fg"><InstagramIcon /></a>}
                {youtube && <a href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-fg"><YoutubeIcon /></a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
