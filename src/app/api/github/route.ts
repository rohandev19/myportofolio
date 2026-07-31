import { fetchGitHubStats } from "@/lib/github/api";
import { secureApiResponse, successResponse, errorResponse } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const stats = await fetchGitHubStats();
    return successResponse(stats);
  } catch (error) {
    console.error("API Route Error:", error);
    return errorResponse("Failed to fetch GitHub statistics", "INTERNAL_ERROR", 500);
  }
}
