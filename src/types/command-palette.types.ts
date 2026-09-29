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
  threshold?: number;
  maxResults?: number;
}

export interface FuzzyResult<T> {
  item: T;
  score: number;
  matchedKey: string;
}
