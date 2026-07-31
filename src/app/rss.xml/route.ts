/**
 * RSS Feed Route Handler
 *
 * Generates an RSS 2.0 XML feed at /rss.xml
 * Excludes draft articles. Uses ISR for automatic updates.
 */

import { parseAllArticles } from "@/lib/mdx/parser";
import { generateRSSFeed } from "@/lib/mdx/rss";

export const revalidate = 3600; // 1 hour

export async function GET() {
  const articles = parseAllArticles();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rohandev.com";

  const rssXml = generateRSSFeed(articles, siteUrl, {
    title: "Rohan's Blog",
    description: "Articles about web development, TypeScript, React, and software engineering.",
    author: "Rohan",
  });

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
