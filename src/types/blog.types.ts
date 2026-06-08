/**
 * Blog System Types
 *
 * Types for MDX blog system with frontmatter metadata support.
 */

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string; // ISO 8601
  updatedAt?: string;
  tags: string[];
  author: string;
  coverImage?: string;
  draft?: boolean;
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
