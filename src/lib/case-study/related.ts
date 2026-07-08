/**
 * Related Case Studies
 *
 * Algorithms to find related projects based on shared tags and technologies.
 *
 * @module lib/case-study/related
 */

import type { CaseStudy, RelatedProject } from "@/types";

/**
 * Map a full CaseStudy to the lighter RelatedProject format
 */
export function mapToRelatedProject(cs: CaseStudy): RelatedProject {
  return {
    slug: cs.slug,
    title: cs.title,
    description: cs.description,
    category: cs.category,
    coverImage: cs.coverImage,
    techStack: cs.techStack.map((t) => t.name),
    tags: cs.tags,
  };
}

/**
 * Find related projects based on shared tags and technologies
 *
 * @param current - The current case study to find relations for
 * @param allProjects - All available case studies
 * @param limit - Maximum number of related projects to return
 */
export function getRelatedProjects(
  current: CaseStudy,
  allProjects: CaseStudy[],
  limit = 3
): RelatedProject[] {
  // Exclude current project
  const otherProjects = allProjects.filter((p) => p.slug !== current.slug);

  const currentTech = new Set(current.techStack.map((t) => t.name.toLowerCase()));
  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));

  // Score projects based on overlap
  const scoredProjects = otherProjects.map((project) => {
    let score = 0;

    // +2 for each shared technology
    for (const tech of project.techStack) {
      if (currentTech.has(tech.name.toLowerCase())) {
        score += 2;
      }
    }

    // +1 for each shared tag
    for (const tag of project.tags) {
      if (currentTags.has(tag.toLowerCase())) {
        score += 1;
      }
    }

    // +1 if same category
    if (project.category.toLowerCase() === current.category.toLowerCase()) {
      score += 1;
    }

    return { project, score };
  });

  // Sort by score (descending), then by date (descending) as fallback
  scoredProjects.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return new Date(b.project.publishedAt).getTime() - new Date(a.project.publishedAt).getTime();
  });

  // Take top N and map to RelatedProject type
  return scoredProjects.slice(0, limit).map((item) => mapToRelatedProject(item.project));
}
