import { create } from "zustand";
import { getSessionFingerprint } from "./fingerprint";

export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: number;
  data?: Record<string, unknown>;
  sessionId: string;
}

interface AnalyticsStore {
  queue: AnalyticsEvent[];
  trackEvent: (name: string, data?: Record<string, unknown>) => void;
  flushQueue: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
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
}));
