import { ArrowRight } from "lucide-react";
import { Link } from "@/components/i18n";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Dict } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function FeaturedProjects({ projects, t }: { projects: Project[]; t: Dict }) {
  return (
    <section className="container-x pb-24 md:pb-32" aria-label={t.home.featured}>
      <SectionHead
        eyebrow={t.home.featured}
        title={t.home.featuredTitle}
        aside={
          <Link href="/work" className="group inline-flex items-center gap-3 text-xs text-fg/85 hover:text-fg">
            {t.home.allProjects}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        }
      />
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} p={p} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
