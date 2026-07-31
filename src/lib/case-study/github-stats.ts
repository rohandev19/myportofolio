/**
 * GitHub API Integration
 *
 * Fetches repository statistics from GitHub using the REST API.
 * Uses Next.js data caching for rate limit protection.
 *
 * @module lib/case-study/github-stats
 */

import type { GitHubStats } from "@/types";

const GITHUB_API_URL = "https://api.github.com/repos";

/**
 * Extract owner and repo name from a GitHub URL
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;

    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

/**
 * Fetch GitHub repository statistics
 *
 * Uses Next.js fetch with revalidation to cache responses and
 * avoid hitting API rate limits.
 */
export async function fetchGitHubStats(url: string): Promise<GitHubStats | null> {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null;

  const { owner, repo } = parsed;
  const endpoint = `${GITHUB_API_URL}/${owner}/${repo}`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add auth token if available in env to increase rate limit
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      lastCommitDate: data.updated_at,
      watchers: data.subscribers_count,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return null;
  }
}
