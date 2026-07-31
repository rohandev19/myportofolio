/**
 * Analytics Dashboard Types
 *
 * Types for privacy-first analytics dashboard with
 * Web Vitals monitoring and visitor insights.
 */

export type WebVitalName = "LCP" | "FID" | "CLS" | "INP" | "TTFB";

export type MetricRating = "good" | "needs-improvement" | "poor";

export type DateRange = "today" | "7d" | "30d" | "custom";

export type ExportFormat = "csv" | "json";

export interface WebVitalThreshold {
  good: number;
  poor: number;
  unit: string;
}

export interface WebVitalMetric {
  name: WebVitalName;
  value: number;
  rating: MetricRating;
  unit: string;
  timestamp: number;
}

export interface PageViewData {
  date: string; // ISO 8601
  views: number;
  uniqueVisitors: number;
}

export interface TopPage {
  path: string;
  views: number;
  uniqueVisitors: number;
}

export interface VisitorInsight {
  totalPageViews: number;
  uniqueVisitors: number;
  topPages: TopPage[];
  pageViewsByDate: PageViewData[];
  referrers: Record<string, number>;
  userAgentTypes: Record<string, number>;
}

export interface PerformanceTimelinePoint {
  timestamp: number;
  metrics: Partial<Record<WebVitalName, number>>;
}

export interface DateRangeFilter {
  type: DateRange;
  startDate?: string; // ISO 8601 — required when type is 'custom'
  endDate?: string; // ISO 8601 — required when type is 'custom'
}

export interface AnalyticsExportData {
  exportedAt: string; // ISO 8601
  dateRange: DateRangeFilter;
  webVitals: WebVitalMetric[];
  visitorInsights: VisitorInsight;
  performanceTimeline: PerformanceTimelinePoint[];
}

export interface DashboardState {
  webVitals: WebVitalMetric[];
  visitorInsights: VisitorInsight | null;
  performanceTimeline: PerformanceTimelinePoint[];
  dateRange: DateRangeFilter;
  isLoading: boolean;
  error: string | null;
}
