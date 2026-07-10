import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { searchArticles } from "../../src/lib/mdx/search";
import type { ArticleFrontmatter } from "../../src/types";

describe("MDX Search Properties", () => {
  const articleArbitrary = fc.record({
    title: fc.string({ minLength: 1 }),
    description: fc.string({ minLength: 1 }),
    content: fc.string(),
    tags: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
    publishedAt: fc.date().map(d => d.toISOString()),
    slug: fc.string({ minLength: 1 }),
  });

  it("empty query returns all articles when no tags are selected", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 10 }),
        (frontmatters) => {
          const articles = frontmatters.map(m => ({ metadata: m, content: "" }));
          const result = searchArticles(articles as any[], { query: "", tags: [] });
          expect(result.length).toBe(articles.length);
        }
      )
    );
  });

  it("search results never exceed input array size", () => {
    fc.assert(
      fc.property(
        fc.array(articleArbitrary, { maxLength: 10 }),
        fc.string(),
        fc.array(fc.string()),
        (frontmatters, query, tags) => {
          const articles = frontmatters.map(m => ({ metadata: m, content: "" }));
          const result = searchArticles(articles as any[], { query, tags });
          expect(result.length).toBeLessThanOrEqual(articles.length);
        }
      )
    );
  });
});
