/**
 * useFuzzySearch Hook
 *
 * React hook wrapper around the fuzzySearch algorithm.
 * Memoizes results and integrates with useDebounce for performance.
 *
 * @example
 * ```typescript
 * const { results, query, setQuery } = useFuzzySearch(commands, ['label', 'keywords']);
 *
 * return (
 *   <input value={query} onChange={(e) => setQuery(e.target.value)} />
 *   {results.map(r => <div key={r.item.id}>{r.item.label}</div>)}
 * );
 * ```
 */

import { useState, useMemo } from "react";
import { fuzzySearch } from "@/lib/search/fuzzy-search";
import { useDebounce } from "./use-debounce";
import type { FuzzySearchOptions, FuzzyResult } from "@/types/command-palette.types";

interface UseFuzzySearchReturn<T> {
  results: FuzzyResult<T>[];
  query: string;
  setQuery: (query: string) => void;
}

export function useFuzzySearch<T extends Record<string, unknown>>(
  items: T[],
  keys: (keyof T)[],
  options?: FuzzySearchOptions & { debounceMs?: number }
): UseFuzzySearchReturn<T> {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, options?.debounceMs ?? 100);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return fuzzySearch(items, keys, debouncedQuery, options);
  }, [items, keys, debouncedQuery, options]);

  return { results, query, setQuery };
}
