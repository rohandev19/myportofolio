/**
 * Portfolio Domain Types
 *
 * Core domain types for portfolio projects, GitHub integration,
 * caching, and rate limiting.
 */

export type ProjectCategory = "web" | "mobile" | "fullstack" | "api" | "devops";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  impact: string[];
  images: string[];
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  featured: boolean;
  publishedAt: string; // ISO 8601
  client?: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface CacheEntry<T> {
  data: T;
  cachedAt: number; // Unix timestamp
  ttl: number; // milliseconds
  staleAt: number; // cachedAt + ttl
}

export interface RateLimitState {
  requests: number[]; // Timestamps of recent requests
  windowStart: number;
}
