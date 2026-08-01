"use client";

import { useEffect } from "react";
import { logError } from "@/lib/error/monitor";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our analytics/error monitor
    logError(error, {
      componentName: "GlobalError",
      message: error.message || "An unexpected error occurred",
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] p-6">
      <div className="max-w-md w-full bg-[var(--color-bg-secondary)] p-8 rounded-2xl border border-red-500/20 text-center shadow-xl">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
          Something went wrong
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          We&apos;ve been notified of the issue and are working to fix it.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[var(--color-accent-blue)] text-[#141418] font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
