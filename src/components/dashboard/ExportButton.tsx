"use client";

/**
 * Export Button Component
 *
 * Allows exporting analytics data as CSV or JSON.
 *
 * @module components/dashboard/ExportButton
 */

import { useState } from "react";
import type { ExportFormat } from "@/types";
import { exportToCSV, exportToJSON, buildExportData, downloadFile } from "@/lib/analytics/export";
import { useAnalyticsStore } from "@/lib/analytics/store";

export function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { webVitals, visitorInsights, dateRange } = useAnalyticsStore();

  const handleExport = (format: ExportFormat) => {
    const data = buildExportData(webVitals, visitorInsights, dateRange);

    if (format === "csv") {
      const { filename, content } = exportToCSV(data);
      downloadFile(filename, content, "text/csv;charset=utf-8");
    } else {
      const { filename, content } = exportToJSON(data);
      downloadFile(filename, content, "application/json");
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
        aria-label="Export analytics data"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Export
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-40 rounded-xl border border-white/10 bg-[#0f172a] shadow-xl z-20 overflow-hidden">
            <button
              onClick={() => handleExport("csv")}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              📄 Export as CSV
            </button>
            <button
              onClick={() => handleExport("json")}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              📋 Export as JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
