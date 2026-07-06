/**
 * RSS Feed Generator
 *
 * Generates a valid RSS 2.0 feed from published articles.
 * Excludes draft articles.
 *
 * @module lib/mdx/rss
 */

import type { Article } from "@/types";

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Format a date for RSS (RFC 822 format)
 */
function toRFC822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

/**
 * Generate a valid RSS 2.0 feed XML from articles
 *
 * @param articles - Array of published articles (drafts will be filtered out)
 * @param siteUrl - Base URL of the website (e.g., "https://example.com")
 * @param feedOptions - Optional feed-level metadata
 * @returns Valid RSS 2.0 XML string
 */
export function generateRSSFeed(
  articles: Article[],
  siteUrl: string,
  feedOptions: {
    title?: string;
    description?: string;
    language?: string;
    author?: string;
  } = {}
): string {
  const {
    title = "Blog",
    description = "Latest articles and insights",
    language = "en",
    author = "Rohan",
  } = feedOptions;

  // Filter out drafts
  const publishedArticles = articles.filter((a) => !a.metadata.draft);

  // Sort by date, newest first
  const sorted = [...publishedArticles].sort(
    (a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );

  const lastBuildDate =
    sorted.length > 0 ? toRFC822(sorted[0].metadata.date) : toRFC822(new Date().toISOString());

  const items = sorted
    .map(
      (article) => `    <item>
      <title>${escapeXml(article.metadata.title)}</title>
      <description>${escapeXml(article.metadata.description)}</description>
      <link>${siteUrl}/blog/${article.metadata.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${article.metadata.slug}</guid>
      <pubDate>${toRFC822(article.metadata.date)}</pubDate>
      <author>${escapeXml(article.metadata.author || author)}</author>${
        article.metadata.tags.length > 0
          ? "\n" +
            article.metadata.tags
              .map((tag) => `      <category>${escapeXml(tag)}</category>`)
              .join("\n")
          : ""
      }
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${siteUrl}</link>
    <language>${language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}
