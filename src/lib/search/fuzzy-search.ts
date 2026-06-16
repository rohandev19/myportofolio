/**
 * Fuzzy Search Algorithm
 *
 * Implements Levenshtein distance for typo-tolerant search.
 * Supports multi-key search across object properties with configurable threshold.
 */

import type { FuzzySearchOptions, FuzzyResult } from "@/types/command-palette.types";

/**
 * Calculate Levenshtein distance between two strings
 *
 * @param a - First string
 * @param b - Second string
 * @returns Edit distance (number of single-character edits)
 */
export function levenshteinDistance(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;

  if (la === 0) return lb;
  if (lb === 0) return la;

  const matrix: number[][] = Array.from({ length: la + 1 }, (_, i) =>
    Array.from({ length: lb + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[la][lb];
}

/**
 * Calculate fuzzy match score between query and target
 *
 * Higher score = better match. Score considers:
 * - Exact match (highest)
 * - Starts with query
 * - Contains query as substring
 * - Levenshtein distance within threshold
 *
 * @returns Score 0-100, 0 means no match
 */
function calculateScore(query: string, target: string, threshold: number): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact match
  if (q === t) return 100;

  // Starts with query
  if (t.startsWith(q)) return 90;

  // Contains query as substring
  if (t.includes(q)) return 75;

  // Word boundary match (query matches start of a word)
  const words = t.split(/[\s\-_]+/);
  for (const word of words) {
    if (word.startsWith(q)) return 70;
  }

  // Levenshtein distance
  // For short queries, compare against each word
  let bestDistance = Infinity;
  for (const word of words) {
    const dist = levenshteinDistance(q, word);
    bestDistance = Math.min(bestDistance, dist);
  }

  // Also compare against full target
  const fullDist = levenshteinDistance(q, t);
  bestDistance = Math.min(bestDistance, fullDist);

  if (bestDistance <= threshold) {
    // Convert distance to score (closer = higher score)
    return Math.max(10, 60 - bestDistance * 20);
  }

  return 0;
}

/**
 * Perform fuzzy search across a collection of items
 *
 * @example
 * ```typescript
 * const commands = [
 *   { id: '1', label: 'Toggle Dark Mode', keywords: ['theme'] },
 *   { id: '2', label: 'Navigate to About', keywords: ['about', 'section'] },
 * ];
 *
 * const results = fuzzySearch(commands, ['label', 'keywords'], 'thme');
 * // Returns: [{ item: commands[0], score: 40, matchedKey: 'keywords' }]
 * ```
 *
 * @param items - Array of objects to search
 * @param keys - Object keys to search across
 * @param query - Search query string
 * @param options - Optional search configuration
 * @returns Sorted array of matching results with scores
 */
export function fuzzySearch<T extends Record<string, unknown>>(
  items: T[],
  keys: (keyof T)[],
  query: string,
  options?: FuzzySearchOptions
): FuzzyResult<T>[] {
  if (!query.trim()) return [];

  const threshold = options?.threshold ?? 2;
  const maxResults = options?.maxResults ?? 50;

  const results: FuzzyResult<T>[] = [];

  for (const item of items) {
    let bestScore = 0;
    let bestKey: string = "";

    for (const key of keys) {
      const value = item[key];
      const targets: string[] = [];

      if (typeof value === "string") {
        targets.push(value);
      } else if (Array.isArray(value)) {
        targets.push(...value.filter((v): v is string => typeof v === "string"));
      }

      for (const target of targets) {
        const score = calculateScore(query, target, threshold);
        if (score > bestScore) {
          bestScore = score;
          bestKey = String(key);
        }
      }
    }

    if (bestScore > 0) {
      results.push({
        item,
        score: bestScore,
        matchedKey: bestKey,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}
