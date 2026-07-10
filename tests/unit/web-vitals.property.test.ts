import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { categorizeMetric } from "../../src/lib/analytics/web-vitals";

describe("Web Vitals Properties", () => {
  it("metric categorization should always return good, needs-improvement, or poor", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("LCP", "FID", "CLS", "INP", "TTFB", "UNKNOWN"),
        fc.double({ min: 0, max: 10000 }),
        (name, value) => {
          const category = categorizeMetric(name as any, value);
          expect(["good", "needs-improvement", "poor"]).toContain(category);
        }
      )
    );
  });
});
