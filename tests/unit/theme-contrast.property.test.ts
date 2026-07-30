/**
 * Property 4: Theme WCAG Contrast Invariant
 *
 * For any text/background color pair defined in theme design tokens,
 * the computed WCAG contrast ratio SHALL be at least 4.5:1.
 *
 * Validates: Requirements 2.7, 9.9
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * Calculate relative luminance according to WCAG 2.1
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;

  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Calculate WCAG contrast ratio
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
function computeContrastRatio(fg: string, bg: string): number {
  const l1 = getRelativeLuminance(hexToRgb(fg));
  const l2 = getRelativeLuminance(hexToRgb(bg));

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

describe("Property 4: Theme WCAG Contrast Invariant", () => {
  // Theme color pairs: [foreground, background]
  const darkThemeColorPairs: Array<[string, string, string]> = [
    ["Primary text on primary bg", "#F8FAFC", "#070B14"],
    ["Secondary text on primary bg", "#94A3B8", "#070B14"],
    ["Primary text on secondary bg", "#F8FAFC", "#0F172A"],
    ["Secondary text on secondary bg", "#94A3B8", "#0F172A"],
    ["Primary text on tertiary bg", "#F8FAFC", "#1E293B"],
    ["Accent blue on primary bg", "#38BDF8", "#070B14"],
    ["Accent violet on primary bg", "#818CF8", "#070B14"],
  ];

  const lightThemeColorPairs: Array<[string, string, string]> = [
    ["Primary text on primary bg", "#0F172A", "#FFFFFF"],
    ["Secondary text on primary bg", "#475569", "#FFFFFF"],
    ["Primary text on secondary bg", "#0F172A", "#F8FAFC"],
    ["Secondary text on secondary bg", "#475569", "#F8FAFC"],
    ["Primary text on tertiary bg", "#0F172A", "#F1F5F9"],
    ["Accent blue on primary bg", "#0369A1", "#FFFFFF"],
    ["Accent violet on primary bg", "#4F46E5", "#FFFFFF"],
  ];

  it("should maintain WCAG AA contrast (4.5:1) for dark theme", () => {
    darkThemeColorPairs.forEach(([label, fg, bg]) => {
      const ratio = computeContrastRatio(fg, bg);
      expect(ratio, `${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    });
  });

  it("should maintain WCAG AA contrast (4.5:1) for light theme", () => {
    lightThemeColorPairs.forEach(([label, fg, bg]) => {
      const ratio = computeContrastRatio(fg, bg);
      expect(ratio, `${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    });
  });

  it("should validate contrast ratio computation is correct", () => {
    // Test known contrast ratios
    const blackOnWhite = computeContrastRatio("#000000", "#FFFFFF");
    expect(blackOnWhite).toBeCloseTo(21, 0); // Perfect contrast

    const whiteOnBlack = computeContrastRatio("#FFFFFF", "#000000");
    expect(whiteOnBlack).toBeCloseTo(21, 0); // Same ratio regardless of order

    const grayOnGray = computeContrastRatio("#888888", "#888888");
    expect(grayOnGray).toBeCloseTo(1, 1); // Same color = no contrast
  });

  it("should fail for insufficient contrast (negative test)", () => {
    // Light gray on white should fail WCAG AA
    const insufficientContrast = computeContrastRatio("#DDDDDD", "#FFFFFF");
    expect(insufficientContrast).toBeLessThan(4.5);
  });

  it("should compute contrast for arbitrary valid hex colors", () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 })
        ),
        fc.tuple(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 })
        ),
        ([r1, g1, b1], [r2, g2, b2]) => {
          const fg = `#${r1.toString(16).padStart(2, "0")}${g1.toString(16).padStart(2, "0")}${b1.toString(16).padStart(2, "0")}`;
          const bg = `#${r2.toString(16).padStart(2, "0")}${g2.toString(16).padStart(2, "0")}${b2.toString(16).padStart(2, "0")}`;

          const ratio = computeContrastRatio(fg, bg);

          // Ratio must be between 1 (no contrast) and 21 (max contrast)
          expect(ratio).toBeGreaterThanOrEqual(1);
          expect(ratio).toBeLessThanOrEqual(21);

          // Ratio should be symmetric (order doesn't matter)
          const reverseRatio = computeContrastRatio(bg, fg);
          expect(ratio).toBeCloseTo(reverseRatio, 10);
        }
      ),
      { numRuns: 100 }
    );
  });
});
