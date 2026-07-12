"use client";

import { TechGalaxyErrorBoundary } from "@/components/error-boundaries/TechGalaxyErrorBoundary";
import { TechGalaxyCanvas } from "@/components/canvas/TechGalaxyCanvas";

export function TechGalaxyScene() {
  return (
    <section
      id="tech-galaxy"
      className="relative w-full min-h-screen bg-[#070B14] py-20 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0F172A] via-[#070B14] to-[#070B14]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC] mb-4">Tech Galaxy</h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto">
            An interactive constellation of my primary and secondary technology stack. Drag to
            explore.
          </p>
        </div>

        <div className="w-full rounded-2xl overflow-hidden border border-[#1E293B] shadow-2xl relative">
          <TechGalaxyErrorBoundary>
            <TechGalaxyCanvas />
          </TechGalaxyErrorBoundary>
        </div>
      </div>
    </section>
  );
}
