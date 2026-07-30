/**
 * API Types
 *
 * Request/response types for API routes.
 */

import type { Repository, ContributionDay } from "./portfolio.types";
import type { AnalyticsEvent } from "./analytics.types";

// Contact API
export interface ContactRequestBody {
  name: string;
  email: string;
  subject?: string;
  message: string;
  honeypot: string; // Must be empty
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// GitHub Stats API
export interface GitHubStatsResponse {
  repos: Repository[];
  contributions: ContributionDay[];
  stats: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
  };
  languageDistribution: Record<string, number>;
  cachedAt: string | null;
}

// Analytics API
export interface AnalyticsIngestPayload {
  events: AnalyticsEvent[];
  sessionId: string;
}

// Generic Error Response
export interface ErrorResponse {
  error: string;
  code: string;
  details?: unknown;
  retryAfter?: number; // seconds
}
