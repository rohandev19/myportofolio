import { useAnalyticsStore } from "../analytics/store";

export interface ErrorDetails {
  message: string;
  stack?: string;
  componentName?: string;
  route?: string;
}

export function logError(error: Error | string, details?: Partial<ErrorDetails>) {
  const errorMessage = typeof error === "string" ? error : error.message;
  const errorStack = typeof error === "string" ? undefined : error.stack;

  // Log locally for debugging
  console.error("[Error Monitor]", errorMessage, details, errorStack);

  // Send to analytics if available
  try {
    const trackEvent = useAnalyticsStore.getState().trackEvent;
    trackEvent("app_error", {
      message: errorMessage,
      stack: errorStack,
      ...details,
    });
  } catch (analyticsError) {
    console.error("Failed to track error in analytics:", analyticsError);
  }
}
