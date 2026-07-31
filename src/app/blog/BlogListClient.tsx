"use client";

/**
 * Blog Listing Page
 *
 * Displays all published articles with search and tag filtering.
 * Client component for interactive search/filter functionality.
 */

import { useState, useCallback, useMemo } from "react";
import type { ArticleMetadata } from "@/types";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { SearchBar } from "@/components/blog/SearchBar";

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
      {/* Search & Filter */}
      <section className="mb-12">
        <SearchBar allTags={allTags} onSearch={handleSearch} />
      </section>

      {/* Results count */}
      <p className="text-sm text-slate-400 mb-6">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Article Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, index) => (
            <ArticleCard
              key={article.slug}
              article={article}
              featured={index === 0 && !article.draft}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-slate-400 mb-2">No articles found</p>
          <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </>
  );
}
