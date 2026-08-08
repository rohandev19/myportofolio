"use client";

/**
 * Visitor Chart Component
 *
 * Line/bar chart for page views over time and top pages table.
 * Uses Recharts for visualization.
 *
 * @module components/dashboard/VisitorChart
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { VisitorInsight } from "@/types";

interface VisitorChartProps {
  data: VisitorInsight;
}

export function VisitorChart({ data }: VisitorChartProps) {
  if (!data || data.pageViewsByDate.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Page Views</h3>
        <div className="flex items-center justify-center h-48 text-[var(--color-text-secondary)]">
          No data available for the selected period
        </div>
      </div>
    );
  }

  const chartData = data.pageViewsByDate.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    views: d.views,
    visitors: d.uniqueVisitors,
  }));

  return (
    <div className="space-y-6">
      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
            Total Page Views
          </p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {data.totalPageViews.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
            Unique Visitors
          </p>
          <p className="text-2xl font-bold text-[var(--color-accent-blue)]">
            {data.uniqueVisitors.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Area Chart */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
          Page Views Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4D8E0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4D8E0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B8794" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7B8794" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-bg-tertiary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  color: "var(--color-text-primary)",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#D4D8E0"
                fill="url(#viewsGrad)"
                strokeWidth={2}
                name="Page Views"
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#7B8794"
                fill="url(#visitorsGrad)"
                strokeWidth={2}
                name="Unique Visitors"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pages Table */}
      {data.topPages.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Top Pages</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Top pages by views">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-2 text-[var(--color-text-secondary)] font-medium">
                    Page
                  </th>
                  <th className="text-right py-3 px-2 text-[var(--color-text-secondary)] font-medium">
                    Views
                  </th>
                  <th className="text-right py-3 px-2 text-[var(--color-text-secondary)] font-medium">
                    Visitors
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map((page) => (
                  <tr
                    key={page.path}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-text-primary)]/5 transition-colors"
                  >
                    <td className="py-2.5 px-2 text-[var(--color-text-primary)] font-mono text-xs">
                      {page.path}
                    </td>
                    <td className="py-2.5 px-2 text-right text-[var(--color-text-secondary)]">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right text-[var(--color-text-tertiary)]">
                      {page.uniqueVisitors.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
