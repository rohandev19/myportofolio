/**
 * MDX Content Parser
 *
 * Parses MDX files from the filesystem into structured Article objects.
 * Handles frontmatter validation, reading time calculation, and word count extraction.
 *
 * @module lib/mdx/parser
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import type { Article, ArticleFrontmatter, ArticleMetadata } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");
const WORDS_PER_MINUTE = 200;

/**
 * Zod schema for validating MDX frontmatter
 */
const frontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date must be a valid ISO 8601 string",
  }),
  updatedAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "updatedAt must be a valid ISO 8601 string",
    })
    .optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1, "Author is required"),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  draft: z.boolean().default(false),
  category: z.string().optional(),
  featured: z.boolean().default(false),
});

/**
 * Validate frontmatter data against the schema
 *
 * @param data - Raw frontmatter object from gray-matter
 * @returns Validated ArticleFrontmatter
 * @throws Error with descriptive validation message
 */
export function validateFrontmatter(data: Record<string, unknown>): ArticleFrontmatter {
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid frontmatter: ${errors}`);
  }
  return result.data as ArticleFrontmatter;
}

/**
 * Extract word count from markdown content
 * Strips MDX/JSX components and markdown syntax before counting.
 *
 * @param content - Raw markdown/MDX content string
 * @returns Number of words in the content
 */
export function extractWordCount(content: string): number {
  // Strip JSX/MDX component tags
  const stripped = content
    .replace(/<[^>]+>/g, "") // Remove HTML/JSX tags
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]+`/g, "") // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove image syntax
    .replace(/\[.*?\]\(.*?\)/g, (match) => {
      // Keep link text, remove URL
      const text = match.match(/\[(.*?)\]/);
      return text ? text[1] : "";
    })
    .replace(/[#*_~>-]/g, " ") // Remove markdown symbols
    .replace(/\s+/g, " ")
    .trim();

  if (!stripped) return 0;
  return stripped.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Calculate reading time based on word count
 *
 * @param content - Raw markdown/MDX content string
 * @returns Reading time in minutes (ceiling of wordCount / 200)
 */
export function calculateReadingTime(content: string): number {
  const wordCount = extractWordCount(content);
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Parse a single MDX file into an Article object
 *
 * @param slug - The filename (without extension) serving as the article slug
 * @returns Parsed Article with validated metadata and content
 * @throws Error if file not found or frontmatter invalid
 */
export function parseMDXFile(slug: string): Article {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Article not found: ${slug}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const frontmatter = validateFrontmatter(data);
  const wordCount = extractWordCount(content);
  const readTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  const metadata: ArticleMetadata = {
    ...frontmatter,
    slug,
    readTime,
    wordCount,
  };

  return { metadata, content };
}

/**
 * Parse all MDX articles from the content directory
 *
 * @param options - Filter options
 * @returns Array of Articles sorted by date (newest first)
 */
export function parseAllArticles(options: { includeDrafts?: boolean } = {}): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx"));

  const articles: Article[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    try {
      const article = parseMDXFile(slug);
      if (!options.includeDrafts && article.metadata.draft) {
        continue;
      }
      articles.push(article);
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
    }
  }

  // Sort by date, newest first
  return articles.sort(
    (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
}

/**
 * Get all article slugs (for generateStaticParams)
 *
 * @returns Array of slug strings
 */
export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Serialize an Article to a plain object (for Next.js props)
 */
export function serializeArticle(article: Article): Article {
  return JSON.parse(JSON.stringify(article));
}

/**
 * Get reading time stats using the reading-time package (alternative)
 */
export function getReadingTimeStats(content: string) {
  return readingTime(content);
}
