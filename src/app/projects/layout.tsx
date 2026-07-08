import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Case Studies | Rohan Portfolio",
  description:
    "Detailed case studies of web applications, platforms, and open-source projects I've built.",
};

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-bg-primary)] pt-16">
      {children}
    </main>
  );
}
