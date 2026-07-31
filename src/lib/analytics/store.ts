/**
 * Analytics Dashboard Store
 *
 * Zustand store managing Web Vitals, visitor insights, and analytics state.
 * Extended from the original analytics event queue store.
 *
 * @module lib/analytics/store
 */

import { create } from "zustand";
import { getSessionFingerprint } from "./fingerprint";
import type {
  WebVitalMetric,
  VisitorInsight,
  PerformanceTimelinePoint,
  DateRangeFilter,
} from "@/types";

export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: number;
  data?: Record<string, unknown>;
  sessionId: string;
}

interface AnalyticsStore {
  // Event queue (original)
  queue: AnalyticsEvent[];
  trackEvent: (name: string, data?: Record<string, unknown>) => void;
  flushQueue: () => Promise<void>;

  // Dashboard state (new)
  webVitals: WebVitalMetric[];
  visitorInsights: VisitorInsight | null;
  performanceTimeline: PerformanceTimelinePoint[];
  dateRange: DateRangeFilter;
  isLoading: boolean;
  error: string | null;

  // Dashboard actions
  setWebVitals: (metrics: WebVitalMetric[]) => void;
  addWebVital: (metric: WebVitalMetric) => void;
  setVisitorInsights: (insights: VisitorInsight) => void;
  addTimelinePoint: (point: PerformanceTimelinePoint) => void;
  setDateRange: (range: DateRangeFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  // === Event Queue (original functionality) ===
  queue: [],
  trackEvent: (name, data) => {
    const newEvent: AnalyticsEvent = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      name,
      timestamp: Date.now(),
      data,
      sessionId: getSessionFingerprint(),
    };

    set((state) => ({ queue: [...state.queue, newEvent] }));

    // Auto-flush if queue reaches 10 items
    if (get().queue.length >= 10) {
      get().flushQueue();
    }
  },
  flushQueue: async () => {
    const { queue } = get();
    if (queue.length === 0) return;

    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: queue }),
        keepalive: true, // Ensure it sends even if user navigates away
      });

      if (response.ok) {
        set({ queue: [] });
      }
    } catch (error) {
      console.error("Failed to flush analytics queue:", error);
    }
  },

  // === Dashboard State (new) ===
  webVitals: [],
  visitorInsights: null,
  performanceTimeline: [],
  dateRange: { type: "7d" },
  isLoading: false,
  error: null,

  // Dashboard actions
  setWebVitals: (metrics) => set({ webVitals: metrics }),
  addWebVital: (metric) =>
    set((state) => {
      // Replace existing metric of same name, or add new
      const existing = state.webVitals.findIndex((m) => m.name === metric.name);
      if (existing >= 0) {
        const updated = [...state.webVitals];
        updated[existing] = metric;
        return { webVitals: updated };
      }
      return { webVitals: [...state.webVitals, metric] };
    }),
  setVisitorInsights: (insights) => set({ visitorInsights: insights }),
  addTimelinePoint: (point) =>
    set((state) => ({
      performanceTimeline: [...state.performanceTimeline, point].slice(-100), // Keep last 100 points
    })),
  setDateRange: (range) => set({ dateRange: range }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
