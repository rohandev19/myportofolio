/**
 * Analytics Types
 *
 * Privacy-first analytics event types and toast notification system.
 */

export type AnalyticsEventType = "page_view" | "web_vital" | "feature_use" | "search";

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  sessionId: string; // Hashed fingerprint
  timestamp: number;
  path: string;
  metadata: Record<string, string | number>;
}

export interface AnalyticsBatchPayload {
  events: AnalyticsEvent[];
  sessionId: string;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // milliseconds (default: 3000)
}
