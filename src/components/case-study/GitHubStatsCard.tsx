/**
 * GitHub Stats Card Component
 *
 * Displays live GitHub repository stats (Stars, Forks, Issues).
 * Data is fetched server-side with caching.
 *
 * @module components/case-study/GitHubStatsCard
 */

import { fetchGitHubStats } from "@/lib/case-study/github-stats";

interface GitHubStatsCardProps {
  githubUrl: string;
}

export async function GitHubStatsCard({ githubUrl }: GitHubStatsCardProps) {
  const stats = await fetchGitHubStats(githubUrl);

  if (!stats) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.858 1.401-8.168-5.934-5.787 8.2-1.192L12 .587z" />
        </svg>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white leading-tight">
            {stats.stars.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Stars</span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
        <svg
          className="w-5 h-5 text-slate-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 7a2 2 0 10-.001-3.999A2 2 0 0012 7zm-1 2v4a3 3 0 003 3h2v-2h-2a1 1 0 01-1-1v-4h-1zm5 4a2 2 0 10-.001 3.999A2 2 0 0016 13zm-8 4a2 2 0 10-.001-3.999A2 2 0 008 17z" />
        </svg>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white leading-tight">
            {stats.forks.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Forks</span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
        <svg
          className="w-5 h-5 text-green-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white leading-tight">
            {stats.openIssues.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Issues</span>
        </div>
      </div>
    </div>
  );
}
