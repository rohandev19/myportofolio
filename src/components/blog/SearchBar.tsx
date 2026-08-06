"use client";

/**
 * Search Bar Component
 *
 * Search input with tag filter chips for blog listing.
 * Uses debounced value for performance.
 *
 * @module components/blog/SearchBar
 */

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  allTags: string[];
  onSearch: (query: string, selectedTags: string[]) => void;
}

export function SearchBar({ allTags, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  // Trigger search when debounced query or tags change
  useEffect(() => {
    onSearch(debouncedQuery, selectedTags);
  }, [debouncedQuery, selectedTags, onSearch]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTags([]);
  };

  const hasFilters = query.trim() !== "" || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-[var(--color-text-tertiary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent-cyan)]/50 focus:ring-1 focus:ring-[var(--color-accent-cyan)]/30 transition-all"
          id="blog-search"
          aria-label="Search articles"
        />
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Tag Filter Chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tags">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  isSelected
                    ? "bg-[var(--color-accent-cyan)]/20 border-[var(--color-accent-cyan)]/50 text-[var(--color-accent-cyan)]"
                    : "bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-blue)]/30 hover:text-[var(--color-text-primary)]"
                }`}
                aria-pressed={isSelected}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
