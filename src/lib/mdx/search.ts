/**
 * Article Search and Filtering
 *
 * Provides search by title/description and tag-based filtering
 * with AND semantics. Results sorted by publication date.
 *
 * @module lib/mdx/search
 */

import type { Article, ArticleMetadata, SearchFilter } from "@/types";

/**
 * Search and filter articles based on criteria
 *
 * - Query matches against title or description (case-insensitive)
 * - Tags filter uses AND operation (article must contain ALL selected tags)
 * - Results sorted by date (newest first)
 *
 * @param articles - Array of articles to search through
 * @param filter - Search and filter criteria
 * @returns Filtered and sorted array of articles
 */
export function searchArticles(articles: Article[], filter: SearchFilter): Article[] {
  let results = [...articles];

  // Filter out drafts if requested
  if (filter.excludeDrafts !== false) {
    results = results.filter((a) => !a.metadata.draft);
  }

  // Search by query (title or description, case-insensitive)
  if (filter.query && filter.query.trim()) {
    const query = filter.query.toLowerCase().trim();
    results = results.filter(
      (a) =>
        a.metadata.title.toLowerCase().includes(query) ||
        a.metadata.description.toLowerCase().includes(query)
    );
  }

  // Filter by tags (AND operation — must contain ALL selected tags)
  if (filter.tags && filter.tags.length > 0) {
    results = results.filter((a) =>
      filter.tags!.every((tag) =>
        a.metadata.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      )
    );
  }

  // Filter by category
  if (filter.category) {
    const category = filter.category.toLowerCase();
    results = results.filter((a) => a.metadata.category?.toLowerCase() === category);
  }

  // Sort by date, newest first
  return sortByDate(results);
}

/**
 * Filter articles by tags using AND operation
 *
 * @param articles - Array of articles
 * @param tags - Tags that must all be present
 * @returns Filtered articles
 */
export function filterByTags(articles: Article[], tags: string[]): Article[] {
  if (tags.length === 0) return articles;

  return articles.filter((a) =>
    tags.every((tag) => a.metadata.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
  );
}

/**
 * Sort articles by publication date, newest first
 *
 * @param articles - Array of articles to sort
 * @returns New sorted array (does not mutate original)
 */
export function sortByDate(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
}

/**
 * Get all unique tags from a collection of articles
 *
 * @param articles - Array of articles
 * @returns Sorted array of unique tag strings
 */
export function getAllTags(articles: Article[]): string[] {
  const tagSet = new Set<string>();
  for (const article of articles) {
    for (const tag of article.metadata.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * Get all unique categories from a collection of articles
 *
 * @param articles - Array of articles
 * @returns Sorted array of unique category strings
 */
export function getAllCategories(articles: Article[]): string[] {
  const categorySet = new Set<string>();
  for (const article of articles) {
    if (article.metadata.category) {
      categorySet.add(article.metadata.category);
    }
  }
  return Array.from(categorySet).sort();
}

/**
 * Search articles and return only metadata (lighter payload)
 *
 * @param articles - Array of articles
 * @param filter - Search criteria
 * @returns Array of ArticleMetadata
 */
export function searchArticleMetadata(
  articles: Article[],
  filter: SearchFilter
): ArticleMetadata[] {
  return searchArticles(articles, filter).map((a) => a.metadata);
}
