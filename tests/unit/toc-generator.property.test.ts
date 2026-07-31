import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { slugifyHeading } from "../../src/lib/mdx/toc";

describe("TOC Generator Properties", () => {
  it("slugify should always return a lowercase string without spaces", () => {
    fc.assert(
      fc.property(
        fc.string(),
        (heading) => {
          const slug = slugifyHeading(heading);
          expect(slug).toBe(slug.toLowerCase());
          expect(slug).not.toMatch(/\s/);
        }
      )
    );
  });
});
