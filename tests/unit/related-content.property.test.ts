import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { getRelatedArticles } from "../../src/lib/mdx/related";

describe("Related Content Properties", () => {
  const articleArbitrary = fc.record({
    slug: fc.string({ minLength: 1 }),
    tags: fc.array(fc.string({ minLength: 1 }), { maxLength: 5 }),
    publishedAt: fc.date().map(d => d.toISOString()),
  });

  it("related articles never include the current article", () => {
    fc.assert(
      fc.property(
        articleArbitrary,
        fc.array(articleArbitrary, { minLength: 1, maxLength: 10 }),
        (current, otherFrontmatters) => {
          // Ensure current is in the list
          const allArticles = [current, ...otherFrontmatters.filter(a => a.slug !== current.slug)].map(m => ({ metadata: m, content: "" }));
          const related = getRelatedArticles(current as any, allArticles as any[], 5);
          
          expect(related.some(a => a.slug === current.slug)).toBe(false);
        }
      )
    );
  });
});
