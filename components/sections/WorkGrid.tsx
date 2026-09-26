"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterChips } from "@/components/ui/FilterChips";
import type { Category, Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function WorkGrid({ projects, categories }: { projects: Project[]; categories: Category[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = params.get("cat") ?? "all";

  const visible = active === "all" ? projects : projects.filter((p) => p.category.slug === active);
  const options = [
    { value: "all", label: "Tout", count: projects.length },
    ...categories.map((c) => ({ value: c.slug, label: c.title, count: projects.filter((p) => p.category.slug === c.slug).length })),
  ];

  return (
    <section className="container-x pb-28" aria-label="Projets">
      <div className="mb-12">
        <FilterChips
          label="Filtrer par catégorie"
          options={options}
          value={active}
          onChange={(v) => router.replace(v === "all" ? pathname : `${pathname}?cat=${v}`, { scroll: false })}
        />
      </div>

      {visible.length === 0 ? (
        <p className="py-24 text-center text-muted">Aucun projet dans cette catégorie pour l&apos;instant.</p>
      ) : (
        <motion.div layout className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => {
              const wide = i % 3 === 0;
              return (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={wide ? "md:col-span-2" : ""}
                >
                  <ProjectCard
                    p={p}
                    aspect={wide ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3] md:aspect-[5/4]"}
                    sizes={wide ? "100vw" : "(min-width:768px) 50vw, 100vw"}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
