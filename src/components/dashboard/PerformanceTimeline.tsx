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
  LCP: "#38bdf8",
  FID: "#818cf8",
  CLS: "#34d399",
  INP: "#fbbf24",
  TTFB: "#f87171",
};

export function PerformanceTimeline({ data }: PerformanceTimelineProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Timeline</h3>
        <div className="flex items-center justify-center h-48 text-slate-400">
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Performance Timeline</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
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
