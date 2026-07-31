"use client";

import { GitHubDashboard } from "../features/github/Dashboard";

export function GithubScene() {
  return (
    <section
      id="github"
      aria-label="GitHub Statistics"
      className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <GitHubDashboard />
      </div>
    </section>
  );
}
