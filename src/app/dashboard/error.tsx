"use client";

import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Dashboard Error</h2>
      <p className="text-slate-400 mb-8">
        {error.message || "Failed to load analytics data. Please try again."}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20 hover:bg-[var(--color-accent-cyan)]/20 transition-colors"
        >
          Retry
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
