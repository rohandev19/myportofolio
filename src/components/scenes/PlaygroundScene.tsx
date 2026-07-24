"use client";

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

export function PlaygroundScene() {
  return (
    <section
      id="playground"
      aria-label="Code Playground"
      className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <CodePlayground />
      </div>
    </section>
  );
}
