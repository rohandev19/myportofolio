"use client";

/**
 * Web Vitals Card Component
 *
 * Displays a single Web Vital metric with color-coded status
 * and an animated gauge indicator.
 *
 * @module components/dashboard/WebVitalsCard
 */

import type { WebVitalMetric } from "@/types";
import {
  formatMetricValue,
  getRatingColor,
  getRatingBgColor,
  WEB_VITAL_THRESHOLDS,
} from "@/lib/analytics/web-vitals";

interface WebVitalsCardProps {
  metric: WebVitalMetric;
}

const METRIC_DESCRIPTIONS: Record<string, string> = {
  LCP: "Largest Contentful Paint",
  FID: "First Input Delay",
  CLS: "Cumulative Layout Shift",
  INP: "Interaction to Next Paint",
  TTFB: "Time to First Byte",
};

export function WebVitalsCard({ metric }: WebVitalsCardProps) {
  const threshold = WEB_VITAL_THRESHOLDS[metric.name];
  const gaugePercent =
    metric.name === "CLS"
      ? Math.min(100, (metric.value / threshold.poor) * 100)
      : Math.min(100, (metric.value / threshold.poor) * 100);

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] ${getRatingBgColor(metric.rating)}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{metric.name}</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {METRIC_DESCRIPTIONS[metric.name]}
          </p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${getRatingColor(metric.rating)} bg-[var(--color-text-primary)]/5`}
        >
          {metric.rating.replace("-", " ")}
        </span>
      </div>

      {/* Value */}
      <p className={`text-3xl font-bold mb-3 ${getRatingColor(metric.rating)}`}>
        {formatMetricValue(metric.name, metric.value)}
      </p>

      {/* Gauge bar */}
      <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
            metric.rating === "good"
              ? "bg-green-500"
              : metric.rating === "needs-improvement"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${gaugePercent}%` }}
        />
        {/* Good threshold marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-[var(--color-text-primary)]/30"
          style={{
            left: `${(threshold.good / threshold.poor) * 100}%`,
          }}
        />
      </div>

      {/* Threshold labels */}
      <div className="flex justify-between mt-1.5 text-[10px] text-[var(--color-text-tertiary)]">
        <span>0</span>
        <span>
          Good: &lt; {metric.name === "CLS" ? threshold.good : `${threshold.good}${threshold.unit}`}
        </span>
        <span>
          Poor: &gt; {metric.name === "CLS" ? threshold.poor : `${threshold.poor}${threshold.unit}`}
        </span>
      </div>
    </div>
  );
}
