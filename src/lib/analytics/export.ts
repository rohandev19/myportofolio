/**
 * Analytics Data Export
 *
 * Export analytics data as CSV or JSON with timestamped filenames.
 * Respects the current date range filter.
 *
 * @module lib/analytics/export
 */

import type { AnalyticsExportData, WebVitalMetric, VisitorInsight, DateRangeFilter } from "@/types";

/**
 * Generate a timestamped filename
 */
function generateFilename(format: "csv" | "json"): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `analytics-export-${timestamp}.${format}`;
}

/**
 * Convert Web Vitals metrics to CSV string
 */
function webVitalsToCSV(metrics: WebVitalMetric[]): string {
  const headers = ["Name", "Value", "Unit", "Rating", "Timestamp"];
  const rows = metrics.map((m) => [
    m.name,
    m.value.toString(),
    m.unit,
    m.rating,
    new Date(m.timestamp).toISOString(),
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Convert Visitor Insights to CSV string
 */
function visitorInsightsToCSV(insights: VisitorInsight): string {
  const sections: string[] = [];

  // Summary
  sections.push("# Summary");
  sections.push("Total Page Views,Unique Visitors");
  sections.push(`${insights.totalPageViews},${insights.uniqueVisitors}`);

  // Page Views by Date
  sections.push("\n# Page Views by Date");
  sections.push("Date,Views,Unique Visitors");
  for (const pv of insights.pageViewsByDate) {
    sections.push(`${pv.date},${pv.views},${pv.uniqueVisitors}`);
  }

  // Top Pages
  sections.push("\n# Top Pages");
  sections.push("Path,Views,Unique Visitors");
  for (const page of insights.topPages) {
    sections.push(`${page.path},${page.views},${page.uniqueVisitors}`);
  }

  // Referrers
  sections.push("\n# Referrers");
  sections.push("Source,Count");
  for (const [source, count] of Object.entries(insights.referrers)) {
    sections.push(`${source},${count}`);
  }

  return sections.join("\n");
}

/**
 * Export analytics data as CSV
 *
 * @param data - Analytics data to export
 * @returns Object with filename and CSV content
 */
export function exportToCSV(data: AnalyticsExportData): {
  filename: string;
  content: string;
} {
  const sections: string[] = [];

  sections.push(`# Analytics Export — ${data.exportedAt}`);
  sections.push(
    `# Date Range: ${data.dateRange.type}${data.dateRange.startDate ? ` (${data.dateRange.startDate} to ${data.dateRange.endDate})` : ""}`
  );

  // Web Vitals
  sections.push("\n## Web Vitals");
  sections.push(webVitalsToCSV(data.webVitals));

  // Visitor Insights
  if (data.visitorInsights) {
    sections.push("\n## Visitor Insights");
    sections.push(visitorInsightsToCSV(data.visitorInsights));
  }

  return {
    filename: generateFilename("csv"),
    content: sections.join("\n"),
  };
}

/**
 * Export analytics data as JSON
 *
 * @param data - Analytics data to export
 * @returns Object with filename and JSON content
 */
export function exportToJSON(data: AnalyticsExportData): {
  filename: string;
  content: string;
} {
  return {
    filename: generateFilename("json"),
    content: JSON.stringify(data, null, 2),
  };
}

/**
 * Build export data object from current dashboard state
 */
export function buildExportData(
  webVitals: WebVitalMetric[],
  visitorInsights: VisitorInsight | null,
  dateRange: DateRangeFilter
): AnalyticsExportData {
  return {
    exportedAt: new Date().toISOString(),
    dateRange,
    webVitals,
    visitorInsights: visitorInsights || {
      totalPageViews: 0,
      uniqueVisitors: 0,
      topPages: [],
      pageViewsByDate: [],
      referrers: {},
      userAgentTypes: {},
    },
    performanceTimeline: [],
  };
}

/**
 * Trigger a file download in the browser
 */
export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
