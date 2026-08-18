"use client";

import { useEffect, useState } from "react";
import type { GitHubStats } from "@/lib/github/api";

export function GitHubDashboard() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        if (data.data) {
          setStats(data.data as GitHubStats);
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] animate-pulse flex flex-col gap-4">
        <div className="h-6 bg-[var(--color-bg-primary)] rounded w-1/4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-[var(--color-bg-primary)] rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-red-500/30 text-center text-[var(--color-text-secondary)]">
        <p>Could not load GitHub statistics.</p>
      </div>
    );
  }

  const topLangs = Object.entries(stats.topLanguages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-accent-blue)]/30 transition-colors shadow-xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[var(--color-accent-blue)]/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <svg
          className="w-6 h-6 text-[var(--color-text-primary)]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">GitHub Open Source</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-[var(--color-bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[var(--color-text-primary)] mb-1">
            {stats.totalStars}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
            Stars
          </span>
        </div>

        <div className="bg-[var(--color-bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[var(--color-text-primary)] mb-1">
            {stats.totalRepos}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
            Repositories
          </span>
        </div>

        <div className="bg-[var(--color-bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[var(--color-text-primary)] mb-1">
            {stats.followers}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
            Followers
          </span>
        </div>

        <div className="bg-[var(--color-bg-primary)] p-4 rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center">
          <div className="flex flex-wrap gap-x-2 gap-y-1 items-baseline justify-center mb-2 text-center w-full">
            {topLangs.map(([lang], idx) => (
              <span
                key={lang}
                className={`font-bold ${idx === 0 ? "text-[var(--color-accent-blue)] text-sm md:text-base" : "text-[var(--color-text-tertiary)] text-xs"}`}
              >
                {lang}
              </span>
            ))}
          </div>
          <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
            Top Languages
          </span>
        </div>
      </div>
    </div>
  );
}
