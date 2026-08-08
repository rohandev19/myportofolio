"use client";

/**
 * Performance Timeline Component
 *
 * Multi-line chart showing Web Vitals metrics over time.
 * Includes tooltip with exact values and a legend.
 *
 * @module components/dashboard/PerformanceTimeline
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PerformanceTimelinePoint, WebVitalName } from "@/types";

interface PerformanceTimelineProps {
  data: PerformanceTimelinePoint[];
}

const METRIC_COLORS: Record<WebVitalName, string> = {
  LCP: "#D4D8E0",
  FID: "#7B8794",
  CLS: "#34d399",
  INP: "#fbbf24",
  TTFB: "#f87171",
};

export function PerformanceTimeline({ data }: PerformanceTimelineProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Performance Timeline
        </h3>
        <div className="flex items-center justify-center h-48 text-[var(--color-text-secondary)]">
          Insufficient data to display performance timeline
        </div>
      </div>
    );
  }

  const chartData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...point.metrics,
  }));

  // Determine which metrics are present
  const availableMetrics = new Set<WebVitalName>();
  for (const point of data) {
    for (const key of Object.keys(point.metrics)) {
      availableMetrics.add(key as WebVitalName);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
        Performance Timeline
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="time"
              stroke="var(--color-text-secondary)"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="var(--color-text-secondary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-bg-tertiary)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                color: "var(--color-text-primary)",
                fontSize: "12px",
              }}
              labelStyle={{ color: "var(--color-text-secondary)" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }} />
            {Array.from(availableMetrics).map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={METRIC_COLORS[metric]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5, strokeWidth: 2 }}
                name={metric}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
