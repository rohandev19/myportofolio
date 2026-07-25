"use client";

import { GitHubDashboard } from "../features/github/Dashboard";
import dynamic from "next/dynamic";

const CodePlayground = dynamic(
  () => import("../features/playground/CodePlayground").then((mod) => mod.CodePlayground),
  {
    loading: () => (
      <div className="h-[400px] w-full bg-[#0F172A] rounded-xl border border-[var(--color-border)] animate-pulse"></div>
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
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">Open Source & Code</h2>
          <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
            Explore my open source contributions and test out some JavaScript directly in the
            browser.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-12 items-center xl:items-stretch justify-center">
          {/* GitHub Stats */}
          <div className="w-full xl:w-auto flex justify-center">
            <GitHubDashboard />
          </div>

          {/* Code Playground */}
          <div className="w-full xl:flex-1 max-w-4xl">
            <CodePlayground />
          </div>
        </div>
      </div>
    </section>
  );
}
