/**
 * Centralized Type Exports
 *
 * Re-exports all type definitions for convenient importing.
 * Import from specific type files for better tree-shaking in large codebases.
 */

// Portfolio types
export type {
  Project,
  ProjectCategory,
  Repository,
  ContributionDay,
  CacheEntry,
  RateLimitState,
} from "./portfolio.types";

// Command Palette types
export type {
  Command,
  CommandCategory,
  FuzzySearchOptions,
  FuzzyResult,
} from "./command-palette.types";

// Analytics types
export type {
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsBatchPayload,
  Toast,
  ToastType,
} from "./analytics.types";

// Blog types
export type {
  ArticleFrontmatter,
  ArticleMetadata,
  Article,
  TOCItem,
  SearchFilter,
  SearchResult,
} from "./blog.types";

// Case Study types
export type {
  TechCategory,
  CaseStudyImage,
  TechStackItem,
  Testimonial,
  GitHubStats,
  CaseStudySection,
  CaseStudy,
  RelatedProject,
} from "./case-study.types";

// Dashboard types
export type {
  WebVitalName,
  MetricRating,
  DateRange,
  ExportFormat,
  WebVitalThreshold,
  WebVitalMetric,
  PageViewData,
  TopPage,
  VisitorInsight,
  PerformanceTimelinePoint,
  DateRangeFilter,
  AnalyticsExportData,
  DashboardState,
} from "./dashboard.types";

// API types
export type {
  ContactRequestBody,
  ContactResponse,
  GitHubStatsResponse,
  AnalyticsIngestPayload,
  ErrorResponse,
} from "./api.types";

// Legacy types for existing components (to be migrated)
export interface ProjectMetric {
  label: string;
  value: string;
}

export interface TimelineEntry {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
}

export interface RoadmapGoal {
  id: string;
  title: string;
  timeframe: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
}

export interface Principle {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface TechStackTier {
  primary: string[];
  secondary: string[];
  ambient: string[];
}
