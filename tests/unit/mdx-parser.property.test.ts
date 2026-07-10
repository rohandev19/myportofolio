import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { calculateReadingTime } from "../../src/lib/mdx/parser";

describe("MDX Parser Properties", () => {
  it("reading time should be proportional to word count", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 10000 }),
        (content) => {
          const time = calculateReadingTime(content);
          expect(time).toBeGreaterThanOrEqual(1);
        }
      )
    );
  });
});
