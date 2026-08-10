"use client";

/**
 * Analytics Dashboard Page
 *
 * Privacy-first analytics dashboard displaying Web Vitals,
 * visitor insights, and performance timeline.
 */

import { useEffect } from "react";
import { useAnalyticsStore } from "@/lib/analytics/store";
import { createWebVitalMetric } from "@/lib/analytics/web-vitals";
import { WebVitalsCard } from "@/components/dashboard/WebVitalsCard";
import { VisitorChart } from "@/components/dashboard/VisitorChart";
import { PerformanceTimeline } from "@/components/dashboard/PerformanceTimeline";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { ExportButton } from "@/components/dashboard/ExportButton";
import type { WebVitalName } from "@/types";

// Demo data for initial state
function generateDemoData() {
  const webVitals: { name: WebVitalName; value: number }[] = [
    { name: "LCP", value: 1850 },
    { name: "FID", value: 45 },
    { name: "CLS", value: 0.04 },
    { name: "INP", value: 120 },
    { name: "TTFB", value: 380 },
  ];

  const now = Date.now();
  const pageViewsByDate = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(now - (13 - i) * 86400000);
    return {
      date: date.toISOString().split("T")[0],
      views: Math.floor(Math.random() * 200) + 50,
      uniqueVisitors: Math.floor(Math.random() * 100) + 20,
    };
  });

  const visitorInsights = {
    totalPageViews: pageViewsByDate.reduce((sum, d) => sum + d.views, 0),
    uniqueVisitors: pageViewsByDate.reduce((sum, d) => sum + d.uniqueVisitors, 0),
    topPages: [
      { path: "/", views: 542, uniqueVisitors: 320 },
      { path: "/blog", views: 287, uniqueVisitors: 195 },
      { path: "/blog/building-scalable-react-apps", views: 156, uniqueVisitors: 112 },
      { path: "/projects", views: 134, uniqueVisitors: 98 },
      { path: "/dashboard/analytics", views: 89, uniqueVisitors: 45 },
    ],
    pageViewsByDate,
    referrers: {
      direct: 340,
      "google.com": 280,
      "twitter.com": 120,
      "github.com": 95,
      "linkedin.com": 67,
    },
    userAgentTypes: {
      Chrome: 450,
      Safari: 180,
      Firefox: 120,
      Edge: 80,
      Other: 42,
    },
  };

  const performanceTimeline = Array.from({ length: 24 }, (_, i) => ({
    timestamp: now - (23 - i) * 3600000,
    metrics: {
      LCP: 1500 + Math.random() * 1500,
      CLS: Math.random() * 0.15,
      INP: 80 + Math.random() * 200,
      TTFB: 200 + Math.random() * 600,
    },
  }));

  return { webVitals, visitorInsights, performanceTimeline };
}

export default function AnalyticsDashboardPage() {
  const {
    webVitals,
    visitorInsights,
    performanceTimeline,
    dateRange,
    setWebVitals,
    setVisitorInsights,
    addTimelinePoint,
    setDateRange,
  } = useAnalyticsStore();

  // Load demo data on mount
  useEffect(() => {
    const demo = generateDemoData();

    const metrics = demo.webVitals.map((v) => createWebVitalMetric(v.name, v.value));
    setWebVitals(metrics);
    setVisitorInsights(demo.visitorInsights);
    for (const point of demo.performanceTimeline) {
      addTimelinePoint(point);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Privacy-first performance monitoring and visitor insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
        </div>
      </header>

      {/* Date Range Filter */}
      <section className="mb-8">
        <DateRangeFilter current={dateRange} onChange={setDateRange} />
      </section>

      {/* Web Vitals Grid */}
      <section className="mb-10" aria-label="Core Web Vitals">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Core Web Vitals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {webVitals.map((metric) => (
            <WebVitalsCard key={metric.name} metric={metric} />
          ))}
          {webVitals.length === 0 && (
            <div className="col-span-full text-center py-12 text-[var(--color-text-secondary)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              No Web Vitals data available yet
            </div>
          )}
        </div>
      </section>

      {/* Visitor Insights */}
      <section className="mb-10" aria-label="Visitor insights">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Visitor Insights
        </h2>
        {visitorInsights ? (
          <VisitorChart data={visitorInsights} />
        ) : (
          <div className="text-center py-12 text-[var(--color-text-secondary)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            No visitor data available
          </div>
        )}
      </section>

      {/* Performance Timeline */}
      <section aria-label="Performance timeline">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Performance Timeline
        </h2>
        <PerformanceTimeline data={performanceTimeline} />
      </section>
    </div>
  );
}
