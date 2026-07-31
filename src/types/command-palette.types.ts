/**
 * Command Palette Types
 *
 * Types for command palette navigation system with fuzzy search support.
 */

export type CommandCategory = "navigation" | "actions" | "settings" | "themes";

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: CommandCategory;
  keywords: string[];
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string[];
  action: () => void | Promise<void>;
}

export interface FuzzySearchOptions {
  threshold?: number; // Max Levenshtein distance (default: 2)
  maxResults?: number; // Max results (default: 50)
}

export interface FuzzyResult<T> {
  item: T;
  score: number; // Higher is better (0-100)
  matchedKey: string; // Which key produced the best match
}
