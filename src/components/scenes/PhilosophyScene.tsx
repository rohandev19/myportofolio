"use client";

import { motion } from "framer-motion";
import { principlesData } from "@/content/principles";
import { viewportConfig, cardFadeUp, staggerContainer } from "@/lib/animations/motion";

export function PhilosophyScene() {
  return (
    <section
      id="philosophy"
      aria-label="Engineering philosophy"
      className="w-full py-24 px-4 md:px-8 bg-[var(--color-bg-secondary)] relative"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={cardFadeUp}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-[var(--color-text-primary)] mb-4">
            Engineering Philosophy
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
            Core principles that guide my approach to software engineering and problem solving.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
        >
          {principlesData.map((principle) => (
            <motion.div
              key={principle.id}
              variants={cardFadeUp}
              whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
              className="principle-card bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-2xl p-8 hover:border-[var(--color-accent-blue)]/50 transition-colors group cursor-default"
            >
              <div className="text-4xl mb-6 text-[var(--color-accent-blue)] group-hover:scale-110 transition-transform origin-left">
                {principle.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                {principle.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
