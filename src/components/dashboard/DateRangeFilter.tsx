"use client";

/**
 * Date Range Filter Component
 *
 * Allows filtering analytics data by predefined or custom date ranges.
 *
 * @module components/dashboard/DateRangeFilter
 */

import type { DateRange, DateRangeFilter as DateRangeFilterType } from "@/types";

interface DateRangeFilterProps {
  current: DateRangeFilterType;
  onChange: (range: DateRangeFilterType) => void;
}

const PRESETS: { label: string; value: DateRange }[] = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
];

export function DateRangeFilter({ current, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Date range filter">
      {PRESETS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onChange({ type: preset.value })}
          className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
            current.type === preset.value
              ? "bg-[var(--color-accent-cyan)]/20 border-[var(--color-accent-cyan)]/50 text-[var(--color-accent-cyan)]"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
          }`}
          aria-pressed={current.type === preset.value}
        >
          {preset.label}
        </button>
      ))}

      {/* Custom range inputs */}
      <div className="flex items-center gap-2 ml-2">
        <input
          type="date"
          value={current.type === "custom" ? current.startDate || "" : ""}
          onChange={(e) =>
            onChange({
              type: "custom",
              startDate: e.target.value,
              endDate: current.endDate || new Date().toISOString().split("T")[0],
            })
          }
          className="px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/5 text-slate-300 focus:outline-none focus:border-[var(--color-accent-cyan)]/50"
          aria-label="Start date"
        />
        <span className="text-slate-500 text-sm">–</span>
        <input
          type="date"
          value={current.type === "custom" ? current.endDate || "" : ""}
          onChange={(e) =>
            onChange({
              type: "custom",
              startDate:
                current.startDate ||
                new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
              endDate: e.target.value,
            })
          }
          className="px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/5 text-slate-300 focus:outline-none focus:border-[var(--color-accent-cyan)]/50"
          aria-label="End date"
        />
      </div>
    </div>
  );
}
