"use client";

import { FallbackProps } from "react-error-boundary";

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-4 text-center">
      <h2 className="text-2xl font-bold text-[var(--color-accent-blue)] mb-4">
        Something went wrong
      </h2>
      <p className="text-[var(--color-text-secondary)] mb-6 max-w-md">
        An unexpected error occurred. This might be due to a temporary issue or an unsupported
        browser feature.
      </p>
      <div className="bg-[var(--color-bg-secondary)] p-4 rounded-md text-sm text-left font-mono overflow-auto max-w-2xl w-full mb-8 text-[var(--color-accent-red)]">
        {error instanceof Error ? error.message : String(error)}
      </div>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] font-semibold rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)]"
      >
        Try again
      </button>
    </div>
  );
}
