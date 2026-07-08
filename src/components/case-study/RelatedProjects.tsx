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
    <section className="my-24 pt-12 border-t border-white/10" aria-label="Related projects">
      <h2 className="text-2xl font-bold text-white mb-8">Related Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[var(--color-accent-cyan)]/30 hover:bg-white/[0.04] hover:-translate-y-1"
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
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <span className="text-slate-500">No Image</span>
              </div>
            )}

            <div className="p-6">
              <span className="text-xs font-semibold text-[var(--color-accent-cyan)] uppercase tracking-wider mb-2 block">
                {project.category}
              </span>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--color-accent-cyan)] transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
