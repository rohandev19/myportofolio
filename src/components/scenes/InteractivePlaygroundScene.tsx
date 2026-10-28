"use client";

import { motion } from "framer-motion";
import { GitHubDashboard } from "../features/github/Dashboard";
import dynamic from "next/dynamic";
import { viewportConfig, cardFadeUp, slideInLeft, slideInRight } from "@/lib/animations/motion";

const CodePlayground = dynamic(
  () => import("../features/playground/CodePlayground").then((mod) => mod.CodePlayground),
  {
    loading: () => (
      <div className="h-[400px] w-full bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] animate-pulse"></div>
    ),
    ssr: false,
  }
);

export function InteractivePlaygroundScene() {
  return (
    <section
      id="playground"
      aria-label="Interactive Code and Stats"
      className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12 z-10">
        <motion.div
          className="text-center mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={cardFadeUp}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-normal text-[var(--color-text-primary)]">
            Open Source &amp; Code
          </h2>
          <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl mx-auto">
            Explore my open source contributions and test out some JavaScript directly in the
            browser.
          </p>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-12 items-center xl:items-stretch justify-center">
          {/* GitHub Stats */}
          <motion.div
            className="w-full xl:w-[320px] flex-shrink-0 flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={slideInLeft}
          >
            <GitHubDashboard />
          </motion.div>

          {/* Code Playground */}
          <motion.div
            className="w-full xl:flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={slideInRight}
          >
            <CodePlayground />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
