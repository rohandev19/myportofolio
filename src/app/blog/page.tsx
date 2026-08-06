/**
 * Blog Listing Page (Server Component)
 *
 * Fetches all articles at build time and passes to client component.
 * Uses ISR with 1-hour revalidation.
 */

import { parseAllArticles } from "@/lib/mdx/parser";
import { getAllTags } from "@/lib/mdx/search";
import { BlogListClient } from "./BlogListClient";

export const revalidate = 3600; // 1 hour ISR

export default function BlogPage() {
  const articles = parseAllArticles();
  const allTags = getAllTags(articles);
  const articleMetadata = articles.map((a) => a.metadata);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
          Blog
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
          Articles about web development, TypeScript, React, and software engineering best
          practices.
        </p>
      </header>

      {/* Client-side interactive list */}
      <BlogListClient articles={articleMetadata} allTags={allTags} />
    </div>
  );
}
