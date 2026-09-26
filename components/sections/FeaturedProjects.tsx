import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section className="container-x pb-24 md:pb-32" aria-label="Projets en vedette">
      <SectionHead
        eyebrow="Projets en vedette"
        title="Un aperçu de mon travail"
        aside={
          <Link href="/work" className="group inline-flex items-center gap-3 text-xs text-fg/85 hover:text-fg">
            Voir tous les projets
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
