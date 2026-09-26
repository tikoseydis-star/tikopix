import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayButton } from "@/components/media/PlayButton";
import { ClipReveal, MaskLines, Reveal } from "@/components/motion/Reveal";
import { getProject, getProjects } from "@/lib/content";
import type { Img } from "@/lib/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProject(slug);
  if (!data) return {};
  const { project } = data;
  return {
    title: project.title,
    description: project.summary,
    openGraph: { images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height }] },
  };
}

/** Rhythm for the gallery: one full-bleed, then a pair, repeat. */
function rows(images: Img[]) {
  const out: Img[][] = [];
  let i = 0;
  while (i < images.length) {
    if (out.length % 2 === 0) out.push([images[i++]]);
    else out.push(images.slice(i, (i += 2)));
  }
  return out;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProject(slug);
  if (!data) notFound();
  const { project: p, next } = data;

  const meta = [
    ["Catégorie", p.eyebrow || p.category.title],
    ["Services", p.services],
    ["Client", p.client],
    ["Lieu", p.location],
    ["Année", p.year],
  ].filter((m): m is [string, string] => !!m[1]);

  return (
    <article>
      <header className="relative h-[88svh] min-h-[560px] overflow-hidden">
        <Image
          src={p.cover.src}
          alt={p.cover.alt}
          fill
          priority
          sizes="100vw"
          placeholder={p.cover.lqip ? "blur" : "empty"}
          blurDataURL={p.cover.lqip}
          className="object-cover"
          style={{ objectPosition: p.cover.position }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-bg/40" />
        <div className="container-x relative flex h-full flex-col justify-end pb-14">
          <Reveal y={10}>
            <Link href={`/work?cat=${p.category.slug}`} className="eyebrow !text-fg/80 hover:!text-violet-soft">
              {p.eyebrow || p.category.title}
            </Link>
          </Reveal>
          <MaskLines as="h1" lines={[p.title]} animateOnMount delay={0.15} className="h-display mt-4 text-[clamp(2.8rem,9vw,8rem)]" />
          {p.video && (
            <Reveal delay={0.4} className="mt-8">
              <PlayButton video={p.video} label="Voir la vidéo" title={p.title} />
            </Reveal>
          )}
        </div>
      </header>

      <section className="container-x grid gap-12 py-20 md:grid-cols-[1fr_1.4fr] md:py-28">
        <dl className="grid grid-cols-2 gap-6 self-start border-t border-line pt-6">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow !text-[9px]">{k}</dt>
              <dd className="mt-2 text-sm text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        {p.summary && (
          <Reveal>
            <p className="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-light leading-snug text-fg" style={{ fontStretch: "105%" }}>
              {p.summary}
            </p>
          </Reveal>
        )}
      </section>

      {p.gallery.length > 0 && (
        <section className="container-x space-y-4 pb-24 sm:space-y-6" aria-label="Galerie">
          {rows(p.gallery).map((row, r) => (
            <div key={r} className={`grid gap-4 sm:gap-6 ${row.length === 2 ? "sm:grid-cols-2" : ""}`}>
              {row.map((img, i) => (
                <ClipReveal key={img.src + i} delay={i * 0.1} className="relative overflow-hidden rounded-sm bg-surface">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes={row.length === 2 ? "(min-width:640px) 50vw, 100vw" : "100vw"}
                    placeholder={img.lqip ? "blur" : "empty"}
                    blurDataURL={img.lqip}
                    className="h-auto w-full"
                  />
                </ClipReveal>
              ))}
            </div>
          ))}
        </section>
      )}

      <Link href={`/work/${next.slug}`} className="group relative block h-[60svh] overflow-hidden border-t border-line" data-cursor="Suivant">
        <Image src={next.cover.src} alt="" fill sizes="100vw" className="object-cover opacity-40 transition-all duration-[1.4s] group-hover:scale-105 group-hover:opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
        <div className="container-x relative flex h-full flex-col justify-center">
          <p className="eyebrow">Projet suivant</p>
          <p className="h-display mt-4 flex items-center gap-6 text-[clamp(2.4rem,7vw,6rem)]">
            {next.title}
            <ArrowRight className="h-[0.6em] w-[0.6em] transition-transform duration-700 group-hover:translate-x-4" strokeWidth={1} />
          </p>
        </div>
      </Link>
    </article>
  );
}
