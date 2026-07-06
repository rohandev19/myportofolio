/**
 * Table of Contents Generator
 *
 * Extracts heading elements from markdown content and builds
 * a hierarchical TOC structure for navigation.
 *
 * @module lib/mdx/toc
 */

import type { TOCItem } from "@/types";

/**
 * Generate a URL-safe slug from heading text
 *
 * @param text - Heading text to slugify
 * @returns URL-safe slug string
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from edges
}

/**
 * Extract headings from markdown content
 *
 * Parses h2, h3, h4 headings from raw markdown text.
 * Does not extract h1 (reserved for article title).
 *
 * @param content - Raw markdown content
 * @returns Flat array of TOCItem objects (without children populated)
 */
export function extractHeadings(content: string): Omit<TOCItem, "children">[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: Omit<TOCItem, "children">[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3 | 4;
    const text = match[2]
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links, keep text
      .trim();

    headings.push({
      id: slugifyHeading(text),
      text,
      level,
    });
  }

  return headings;
}

/**
 * Build a hierarchical TOC structure from flat heading list
 *
 * Nests h3 under h2, h4 under h3 to create a tree structure.
 *
 * @param headings - Flat array of headings
 * @returns Hierarchical array of TOCItem with nested children
 */
export function buildHierarchy(headings: Omit<TOCItem, "children">[]): TOCItem[] {
  const toc: TOCItem[] = [];
  const stack: TOCItem[] = [];

  for (const heading of headings) {
    const item: TOCItem = { ...heading, children: [] };

    // Pop from stack until we find a parent with a lower level
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Top-level heading (h2)
      toc.push(item);
    } else {
      // Nest under parent
      stack[stack.length - 1].children.push(item);
    }

    stack.push(item);
  }

  return toc;
}

/**
 * Generate a complete Table of Contents from markdown content
 *
 * Main entry point: extracts headings and builds hierarchy.
 *
 * @param content - Raw markdown content
 * @returns Hierarchical array of TOCItem
 */
export function generateTOC(content: string): TOCItem[] {
  const headings = extractHeadings(content);
  return buildHierarchy(headings);
}

/**
 * Flatten a hierarchical TOC back to a flat heading list
 * Useful for testing round-trip properties.
 *
 * @param toc - Hierarchical TOC
 * @returns Flat array of heading text strings
 */
export function flattenTOC(toc: TOCItem[]): string[] {
  const result: string[] = [];

  function walk(items: TOCItem[]) {
    for (const item of items) {
      result.push(item.text);
      walk(item.children);
    }
  }

  walk(toc);
  return result;
}
