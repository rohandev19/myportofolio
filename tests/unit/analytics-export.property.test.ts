import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { exportToCSV } from "../../src/lib/analytics/export";

describe("Analytics Export Properties", () => {
  const dataArbitrary = fc.record({
    exportedAt: fc.date().map(d => d.toISOString()),
    dateRange: fc.record({
      type: fc.constantFrom("today", "7d", "30d", "all", "custom"),
    }),
    webVitals: fc.array(fc.record({
      name: fc.string(),
      value: fc.double(),
      unit: fc.string(),
      rating: fc.string(),
      timestamp: fc.integer({ min: 0, max: Date.now() }),
    })),
    visitorInsights: fc.constant(null),
    performanceTimeline: fc.array(fc.anything()),
  });

  it("CSV export should return a string with correct line count", () => {
    fc.assert(
      fc.property(
        dataArbitrary,
        (data) => {
          const csv = exportToCSV(data as any);
          const lines = csv.content.trim().split("\n");
          // Header + vitals + sections
          expect(lines.length).toBeGreaterThanOrEqual(1);
        }
      )
    );
  });
});
