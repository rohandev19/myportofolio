"use client";

import Link from "next/link";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
        Something went wrong
      </h2>
      <p className="text-[var(--color-text-secondary)] mb-8">
        {error.message || "Failed to load project data. Please try again."}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-6 py-2.5 btn-unified font-semibold rounded-lg hover:opacity-90 transition-all"
        >
          Try Again
        </button>
        <Link
          href="/projects"
          className="px-6 py-3 rounded-xl bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-text-primary)]/10 transition-colors"
        >
          All Projects
        </Link>
      </div>
    </div>
  );
}
