/**
 * Animation Presets
 *
 * Centralized GSAP animation presets for consistent micro-interactions.
 * All presets respect reduced-motion preferences.
 */

export const AnimationPresets = {
  fadeInUp: {
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
  },
  scaleIn: {
    from: { scale: 0.95, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
  },
  slideInTop: {
    from: { y: -20, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
  },
  ripple: {
    from: { scale: 0, opacity: 0.6 },
    to: { scale: 2, opacity: 0, duration: 0.6, ease: "power2.out" },
  },
  shimmer: {
    from: { x: "-100%" },
    to: { x: "100%", duration: 1.5, ease: "linear", repeat: -1 },
  },
  hoverScale: {
    scale: 1.05,
    duration: 0.2,
    ease: "power2.out",
  },
  hoverGlow: {
    boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
    duration: 0.3,
    ease: "power2.out",
  },
} as const;

export type AnimationPreset = keyof typeof AnimationPresets;
