"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { Link, useDict } from "@/components/i18n";
import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import type { Settings } from "@/lib/types";

/** Two-line brush-script call to action over a parallax landscape. */
export function CtaSection({ s }: { s: Settings }) {
  const ref = useRef<HTMLElement>(null);
  const t = useDict();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const words = s.ctaText.split(" ");
  const mid = Math.ceil(words.length / 2);
  const lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];

  return (
    <section ref={ref} className="relative overflow-hidden" aria-label={t.cta.contactMe}>
      <motion.div className="absolute inset-[-25%_0]" style={{ y }}>
        <Image src={s.ctaImage.src} alt="" fill sizes="100vw" className="object-cover opacity-60" style={{ objectPosition: s.ctaImage.position }} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/40 to-bg" />
      <div className="container-x relative flex flex-col items-center justify-center gap-10 py-28 text-center sm:flex-row sm:gap-20 sm:text-left md:py-36">
        <motion.h2
          className="font-script text-[clamp(2.2rem,5vw,3.8rem)] uppercase leading-[1.05] text-violet-soft"
          style={{ skewX: -8 }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {lines.map((l, i) => (
            <span key={i} className="-my-[0.15em] block overflow-hidden px-[0.15em] py-[0.15em]">
              <motion.span
                className="block"
                variants={{ hidden: { y: "140%" }, show: { y: "0%" } }}
                transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </motion.h2>
        <Magnetic>
          <Link href="/contact" className="btn-ghost">
            {t.cta.contactMe} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
