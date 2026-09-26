import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/components/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { CategoryGlyph } from "@/components/ui/Icons";
import { SectionHead } from "@/components/ui/SectionHead";
import { TiltCard } from "@/components/ui/TiltCard";
import type { Dict } from "@/lib/i18n";
import type { Category } from "@/lib/types";

export function Specialties({ title, text, categories, t }: { title: string; text: string; categories: Category[]; t: Dict }) {
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="specialites">
      <SectionHead eyebrow={t.home.specialties} title={title} aside={<p id="specialites" className="text-sm leading-relaxed text-muted">{text}</p>} />
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((c, i) => (
          <li key={c.slug}>
            <Reveal delay={i * 0.08}>
              <TiltCard className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/3.2]">
                <Link
                  href={`/work?cat=${c.slug}`}
                  data-cursor={t.cursor.view}
                  className="group relative block h-full overflow-hidden rounded-md border border-line bg-surface"
                >
                  <Image
                    src={c.cover.src}
                    alt={c.cover.alt}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    placeholder={c.cover.lqip ? "blur" : "empty"}
                    blurDataURL={c.cover.lqip}
                    className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-110"
                    style={{ objectPosition: c.cover.position }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4 sm:p-5 [transform:translateZ(40px)]">
                    <CategoryGlyph icon={c.icon} className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                    <span className="flex-1 font-display text-[13px] font-medium uppercase tracking-[0.08em] sm:text-sm">{c.title}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-violet-soft" strokeWidth={1.5} />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-violet transition-transform duration-700 group-hover:scale-x-100" />
                </Link>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
