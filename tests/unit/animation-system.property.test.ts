/**
 * Property 13: Reduced Motion Compliance
 *
 * Validates: Requirements 8.12, 8.13, 8.14
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fc from "fast-check";
import { prefersReducedMotion, withReducedMotion } from "@/lib/animations/reduced-motion";
import { AnimationPresets } from "@/lib/animations/presets";

describe("Property 13: Reduced Motion Compliance", () => {
  beforeEach(() => {
    // Reset matchMedia mock before each test
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("should detect prefers-reduced-motion preference", () => {
    // Mock reduced motion enabled
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    expect(prefersReducedMotion()).toBe(true);

    // Mock reduced motion disabled
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: no-preference)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    expect(prefersReducedMotion()).toBe(false);
  });

  it("should set duration to 0 when reduced motion is preferred", () => {
    // Enable reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const testPresets = [
      { duration: 0.5, x: 50, y: 100 },
      { duration: 1.0, scale: 1.5, opacity: 0.8 },
      { duration: 0.3, rotate: 360 },
    ];

    testPresets.forEach((preset) => {
      const reduced = withReducedMotion(preset);
      expect(reduced.duration).toBe(0);
    });
  });

  it("should remove motion transforms when reduced motion is preferred", () => {
    // Enable reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const testPresets = [
      { x: 50, y: -20, opacity: 0.5, duration: 0.8 },
      { scale: 1.5, rotate: 180, opacity: 1, duration: 0.5 },
      { x: -100, scale: 0.9, opacity: 0.3, duration: 1.0 },
    ];

    testPresets.forEach((preset) => {
      const reduced = withReducedMotion(preset);

      // Motion transforms should be removed
      expect(reduced.x).toBeUndefined();
      expect(reduced.y).toBeUndefined();
      expect(reduced.scale).toBeUndefined();
      expect(reduced.rotate).toBeUndefined();

      // Opacity should be preserved
      expect(reduced.opacity).toBe(preset.opacity);
      // Duration should be 0
      expect(reduced.duration).toBe(0);
    });
  });

  it("should preserve opacity changes even with reduced motion", () => {
    // Enable reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const testCases = [
      { opacity: 0, x: 50, duration: 0.5 },
      { opacity: 0.5, x: -20, duration: 0.8 },
      { opacity: 1, x: 100, duration: 1.0 },
    ];

    testCases.forEach(({ opacity, x, duration }) => {
      const preset = { opacity, x, duration };
      const reduced = withReducedMotion(preset);

      // Opacity should be preserved
      expect(reduced.opacity).toBe(opacity);
      // Motion should be removed
      expect(reduced.x).toBeUndefined();
    });
  });

  it("should return preset unchanged when reduced motion is NOT preferred", () => {
    // Disable reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: "",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const testPresets = [
      { x: 50, y: -20, duration: 0.5 },
      { scale: 1.5, duration: 0.8 },
      { x: -100, scale: 0.9, rotate: 45, duration: 1.0 },
    ];

    testPresets.forEach((preset) => {
      const result = withReducedMotion(preset);
      // Should be unchanged
      expect(result).toEqual(preset);
    });
  });

  it("should handle all animation presets with reduced motion", () => {
    // Enable reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Test all built-in presets
    Object.entries(AnimationPresets).forEach(([name, preset]) => {
      if ("to" in preset) {
        const reduced = withReducedMotion(preset.to);
        expect(reduced.duration).toBe(0);
      }
    });
  });

  it("should remove delay when reduced motion is preferred", () => {
    // Enable reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const testPresets = [
      { duration: 0.5, delay: 0.2, x: 50 },
      { duration: 1.0, delay: 0.5, scale: 1.5 },
      { duration: 0.8, delay: 0.3, y: -20 },
    ];

    testPresets.forEach((preset) => {
      const reduced = withReducedMotion(preset);
      // Delay should be 0
      expect(reduced.delay).toBe(0);
      // Duration should be 0
      expect(reduced.duration).toBe(0);
    });
  });
});

describe("Animation Presets Structure", () => {
  it("should have valid structure for all presets", () => {
    Object.entries(AnimationPresets).forEach(([name, preset]) => {
      // Check that preset has required properties
      if ("to" in preset) {
        expect(preset.to).toHaveProperty("duration");
        expect(preset.to).toHaveProperty("ease");
      } else {
        expect(preset).toHaveProperty("duration");
        expect(preset).toHaveProperty("ease");
      }
    });
  });

  it("should have reasonable duration values", () => {
    Object.entries(AnimationPresets).forEach(([name, preset]) => {
      const duration = "to" in preset ? preset.to.duration : preset.duration;

      if (typeof duration === "number") {
        expect(duration).toBeGreaterThan(0);
        expect(duration).toBeLessThanOrEqual(5); // Max 5 seconds
      }
    });
  });
});
