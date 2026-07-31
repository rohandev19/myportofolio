/**
 * Blog System Types
 *
 * Types for MDX blog system with frontmatter metadata,
 * table of contents, search, and content filtering.
 */

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string; // ISO 8601
  updatedAt?: string;
  tags: string[];
  author: string;
  coverImage?: string;
  coverImageAlt?: string;
  draft?: boolean;
  category?: string;
  featured?: boolean;
}

export interface ArticleMetadata extends ArticleFrontmatter {
  slug: string;
  readTime: number; // minutes
  wordCount: number;
}

export interface Article {
  metadata: ArticleMetadata;
  content: string;
}

/** Table of Contents item extracted from headings */
export interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3 | 4;
  children: TOCItem[];
}

/** Search filter criteria for article queries */
export interface SearchFilter {
  query?: string;
  tags?: string[];
  category?: string;
  excludeDrafts?: boolean;
}

/** Search result wrapping an article with relevance score */
export interface SearchResult {
  article: ArticleMetadata;
  relevanceScore: number;
}
