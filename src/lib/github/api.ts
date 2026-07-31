const GITHUB_USERNAME = "rohandev19";
const GITHUB_API_URL = "https://api.github.com";

export interface GitHubStats {
  totalStars: number;
  totalRepos: number;
  followers: number;
  topLanguages: { [key: string]: number };
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
  const headers = new Headers({
    Accept: "application/vnd.github.v3+json",
  });

  if (process.env.GITHUB_TOKEN) {
    headers.append("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}`, {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }),
      fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?per_page=100`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error("Failed to fetch GitHub data");
    }

    const userData = await userRes.json();
    const reposData = await reposRes.json();

    const stats: GitHubStats = {
      totalStars: 0,
      totalRepos: userData.public_repos,
      followers: userData.followers,
      topLanguages: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reposData.forEach((repo: any) => {
      stats.totalStars += repo.stargazers_count;

      if (repo.language) {
        stats.topLanguages[repo.language] = (stats.topLanguages[repo.language] || 0) + 1;
      }
    });

    return stats;
  } catch (error) {
    console.error("GitHub fetch error:", error);
    throw error;
  }
}
