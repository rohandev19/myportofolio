/**
 * Reduced Motion Utilities
 *
 * Utilities for respecting user's prefers-reduced-motion preference.
 * Critical for accessibility compliance (WCAG).
 */

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Apply reduced motion override to animation preset
 *
 * When reduced motion is preferred:
 * - Duration becomes 0 (instant)
 * - Removes motion-based transforms (translate, rotate, scale)
 * - Keeps opacity changes (acceptable for reduced motion)
 */
export function withReducedMotion<T extends Record<string, unknown>>(preset: T): T {
  if (!prefersReducedMotion()) return preset;

  const reduced: Record<string, unknown> = {
    ...preset,
    duration: 0,
    delay: 0,
  };

  // Remove motion transforms
  if ("x" in reduced) delete reduced.x;
  if ("y" in reduced) delete reduced.y;
  if ("scale" in reduced) delete reduced.scale;
  if ("rotate" in reduced) delete reduced.rotate;
  if ("skewX" in reduced) delete reduced.skewX;
  if ("skewY" in reduced) delete reduced.skewY;

  return reduced as T;
}

/**
 * Create a media query context for GSAP matchMedia
 * to disable expensive animations on low-performance devices
 */
export function createPerformanceMediaQuery() {
  return {
    reducedMotion: "(prefers-reduced-motion: reduce)",
    highPerformance: "(prefers-reduced-motion: no-preference) and (hover: hover)",
  };
}
