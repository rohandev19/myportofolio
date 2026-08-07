/**
 * Related Projects Component
 *
 * Displays a grid of related projects (cards).
 *
 * @module components/case-study/RelatedProjects
 */

import Link from "next/link";
import Image from "next/image";
import type { RelatedProject } from "@/types";

interface RelatedProjectsProps {
  projects: RelatedProject[];
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section
      className="my-24 pt-12 border-t border-[var(--color-border)]"
      aria-label="Related projects"
    >
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">Related Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden transition-all duration-300 hover:border-[var(--color-accent-blue)]/30 hover:bg-[var(--color-text-primary)]/[0.04] hover:-translate-y-1"
          >
            {project.coverImage ? (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.coverImage.src}
                  alt={project.coverImage.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-border)] flex items-center justify-center">
                <span className="text-[var(--color-text-tertiary)]">No Image</span>
              </div>
            )}

            <div className="p-6">
              <span className="text-xs font-semibold text-[var(--color-accent-blue)] uppercase tracking-wider mb-2 block">
                {project.category}
              </span>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-blue)] transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
