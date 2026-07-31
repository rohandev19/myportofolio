import { NextResponse } from "next";
import { fetchGitHubStats } from "@/lib/github/api";
import { secureApiResponse } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const stats = await fetchGitHubStats();
    return secureApiResponse(stats);
  } catch (error) {
    console.error("API Route Error:", error);
    return secureApiResponse({ error: "Failed to fetch GitHub statistics" }, 500);
  }
}
