"use client";

/**
 * Blog Listing Page
 *
 * Displays all published articles with search, tag filtering,
 * and Framer Motion repeated scroll-reveal animations.
 */

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { ArticleMetadata } from "@/types";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { SearchBar } from "@/components/blog/SearchBar";
import { viewportConfig, cardFadeUp } from "@/lib/animations/motion";

interface BlogListClientProps {
  articles: ArticleMetadata[];
  allTags: string[];
}

export function BlogListClient({ articles, allTags }: BlogListClientProps) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSearch = useCallback((q: string, tags: string[]) => {
    setQuery(q);
    setSelectedTags(tags);
  }, []);

  const filtered = useMemo(() => {
    let results = [...articles];

    // Search by query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      );
    }

    // Filter by tags (AND)
    if (selectedTags.length > 0) {
      results = results.filter((a) =>
        selectedTags.every((tag) => a.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
      );
    }

    return results;
  }, [articles, query, selectedTags]);

  return (
    <>
      {/* Page Header */}
      <motion.header
        className="mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={cardFadeUp}
      >
        <h1 className="text-4xl md:text-5xl font-serif font-normal text-[var(--color-text-primary)] mb-4">
          Blog
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
          Articles about web development, TypeScript, React, and software engineering best
          practices.
        </p>
      </motion.header>

      {/* Search & Filter */}
      <motion.section
        className="mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={cardFadeUp}
      >
        <SearchBar allTags={allTags} onSearch={handleSearch} />
      </motion.section>

      {/* Results count */}
      <motion.p
        className="text-sm text-[var(--color-text-secondary)] mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
      </motion.p>

      {/* Article Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, index) => {
            const isFeatured = index === 0 && !article.draft;
            return (
              <motion.div
                key={article.slug}
                className={`h-full ${isFeatured ? "md:col-span-2" : ""}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: (index % 3) * 0.1,
                }}
              >
                <ArticleCard article={article} featured={isFeatured} />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-[var(--color-text-secondary)] mb-2">No articles found</p>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </>
  );
}
