"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TechGalaxyErrorBoundary } from "@/components/error-boundaries/TechGalaxyErrorBoundary";
import { viewportConfig, cardFadeUp, scaleFadeIn } from "@/lib/animations/motion";

const TechGalaxyCanvas = dynamic(
  () => import("@/components/canvas/TechGalaxyCanvas").then((mod) => mod.TechGalaxyCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-[#141418]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent-blue)] border-t-transparent animate-spin" />
          <span className="text-xs text-[var(--color-text-secondary)] font-mono">
            Loading Tech Galaxy...
          </span>
        </div>
      </div>
    ),
  }
);

export function TechGalaxyScene() {
  return (
    <section
      id="tech-galaxy"
      aria-label="Technology stack galaxy"
      className="relative w-full min-h-screen bg-[var(--color-bg-primary)] py-20 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-bg-secondary)] via-[var(--color-bg-primary)] to-[var(--color-bg-primary)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={cardFadeUp}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-[var(--color-text-primary)] mb-4">
            Tech Galaxy
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            An interactive constellation of my primary and secondary technology stack. Drag to
            explore.
          </p>
        </motion.div>

        <motion.div
          className="w-full rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-2xl relative"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={scaleFadeIn}
        >
          <TechGalaxyErrorBoundary>
            <TechGalaxyCanvas />
          </TechGalaxyErrorBoundary>
        </motion.div>
      </div>
    </section>
  );
}
