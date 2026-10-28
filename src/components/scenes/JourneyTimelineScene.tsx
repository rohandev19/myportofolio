"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { timelineData } from "@/content/timeline";
import { viewportConfig } from "@/lib/animations/motion";

export function JourneyTimelineScene() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the main timeline line with scrub
      if (lineRef.current && containerRef.current) {
        gsap.fromTo(
          lineRef.current,
          { height: 0 },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 1,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={containerRef}
      aria-label="Career journey timeline"
      className="min-h-screen w-full py-24 px-4 md:px-8 bg-[var(--color-bg-secondary)] relative"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-serif font-normal text-center text-[var(--color-text-primary)] mb-20"
        >
          Where I&apos;ve Been
        </motion.h2>

        <div className="relative">
          {/* Central Line Background */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-border)] -translate-x-1/2" />

          {/* Animated Highlight Line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-[var(--color-accent-blue)] to-[var(--color-teal)] -translate-x-1/2 origin-top"
          />

          <div className="flex flex-col gap-12">
            {timelineData.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -45 : 45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportConfig}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className={`timeline-item flex flex-col md:flex-row gap-8 relative z-10 ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-accent-blue)] -translate-x-1/2 mt-1.5" />

                {/* Content Side */}
                <div
                  className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                >
                  <div className="text-[var(--color-accent-blue)] font-mono text-sm font-bold mb-2">
                    {entry.year}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                    {entry.role}
                  </h3>
                  <div className="text-[var(--color-text-secondary)] font-medium mb-3">
                    {entry.company}
                  </div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {entry.description}
                  </p>
                </div>

                {/* Empty Side for Spacing */}
                <div className="hidden md:block w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
