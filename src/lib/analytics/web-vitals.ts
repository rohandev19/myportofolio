/**
 * Web Vitals Monitoring
 *
 * Collects and categorizes Core Web Vitals metrics.
 * Provides threshold-based rating (good/needs-improvement/poor).
 *
 * @module lib/analytics/web-vitals
 */

import type { WebVitalName, MetricRating, WebVitalThreshold, WebVitalMetric } from "@/types";

/**
 * Web Vitals thresholds per Google's recommendations
 * https://web.dev/vitals/
 */
export const WEB_VITAL_THRESHOLDS: Record<WebVitalName, WebVitalThreshold> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  FID: { good: 100, poor: 300, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  INP: { good: 200, poor: 500, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
};

/**
 * Categorize a Web Vital metric value as good, needs-improvement, or poor
 *
 * @param name - The metric name (LCP, FID, CLS, INP, TTFB)
 * @param value - The metric value
 * @returns Rating: 'good' | 'needs-improvement' | 'poor'
 */
export function categorizeMetric(name: WebVitalName, value: number): MetricRating {
  const threshold = WEB_VITAL_THRESHOLDS[name];
  if (!threshold) return "poor";

  if (value <= threshold.good) return "good";
  if (value > threshold.poor) return "poor";
  return "needs-improvement";
}

/**
 * Create a WebVitalMetric object from raw metric data
 *
 * @param name - Metric name
 * @param value - Metric value
 * @returns Complete WebVitalMetric with rating and unit
 */
export function createWebVitalMetric(name: WebVitalName, value: number): WebVitalMetric {
  const threshold = WEB_VITAL_THRESHOLDS[name];
  return {
    name,
    value,
    rating: categorizeMetric(name, value),
    unit: threshold?.unit || "",
    timestamp: Date.now(),
  };
}

/**
 * Format a metric value for display
 *
 * @param name - Metric name
 * @param value - Raw metric value
 * @returns Formatted string (e.g., "2.5s", "0.05", "120ms")
 */
export function formatMetricValue(name: WebVitalName, value: number): string {
  if (name === "CLS") {
    return value.toFixed(3);
  }
  if (name === "LCP") {
    return `${(value / 1000).toFixed(1)}s`;
  }
  return `${Math.round(value)}ms`;
}

/**
 * Get the color class for a metric rating
 */
export function getRatingColor(rating: MetricRating): string {
  switch (rating) {
    case "good":
      return "text-green-400";
    case "needs-improvement":
      return "text-yellow-400";
    case "poor":
      return "text-red-400";
  }
}

/**
 * Get the background color class for a metric rating
 */
export function getRatingBgColor(rating: MetricRating): string {
  switch (rating) {
    case "good":
      return "bg-green-500/10 border-green-500/30";
    case "needs-improvement":
      return "bg-yellow-500/10 border-yellow-500/30";
    case "poor":
      return "bg-red-500/10 border-red-500/30";
  }
}

/**
 * Check if all metrics are within good thresholds
 */
export function allMetricsGood(metrics: WebVitalMetric[]): boolean {
  return metrics.every((m) => m.rating === "good");
}
