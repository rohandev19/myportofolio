import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Rohan Portfolio",
  description:
    "Articles about web development, TypeScript, React, and software engineering best practices.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen">
      {children}
    </main>
  );
}
