/**
 * Related Articles Engine
 *
 * Suggests related articles based on shared tags.
 * Falls back to most recent articles when no tags match.
 *
 * @module lib/mdx/related
 */

import type { Article, ArticleMetadata } from "@/types";

/**
 * Calculate relevance score between two articles based on shared tags
 *
 * @param current - The reference article
 * @param candidate - The candidate article to score
 * @returns Number of shared tags (higher = more relevant)
 */
function calculateTagRelevance(current: ArticleMetadata, candidate: ArticleMetadata): number {
  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));
  return candidate.tags.filter((t) => currentTags.has(t.toLowerCase())).length;
}

/**
 * Get related articles for a given article
 *
 * Algorithm:
 * 1. Exclude the current article
 * 2. Score each candidate by shared tags
 * 3. Sort by relevance (descending), then by date (newest first) for ties
 * 4. If no articles share tags, return most recent articles
 *
 * @param current - The current article's metadata
 * @param allArticles - All available articles
 * @param limit - Maximum number of related articles to return (default: 5)
 * @returns Array of related ArticleMetadata
 */
export function getRelatedArticles(
  current: ArticleMetadata,
  allArticles: Article[],
  limit: number = 5
): ArticleMetadata[] {
  // Exclude current article and drafts
  const candidates = allArticles.filter(
    (a) => a.metadata.slug !== current.slug && !a.metadata.draft
  );

  if (candidates.length === 0) return [];

  // Score and sort candidates
  const scored = candidates.map((a) => ({
    metadata: a.metadata,
    relevance: calculateTagRelevance(current, a.metadata),
  }));

  scored.sort((a, b) => {
    // Primary sort: relevance (more shared tags first)
    if (b.relevance !== a.relevance) {
      return b.relevance - a.relevance;
    }
    // Secondary sort: date (newest first)
    return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
  });

  return scored.slice(0, limit).map((s) => s.metadata);
}

/**
 * Get the most recent articles, excluding a specific one
 *
 * @param excludeSlug - Slug of article to exclude
 * @param allArticles - All available articles
 * @param limit - Maximum number of articles to return
 * @returns Array of most recent ArticleMetadata
 */
export function getMostRecentArticles(
  excludeSlug: string,
  allArticles: Article[],
  limit: number = 5
): ArticleMetadata[] {
  return allArticles
    .filter((a) => a.metadata.slug !== excludeSlug && !a.metadata.draft)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .slice(0, limit)
    .map((a) => a.metadata);
}
