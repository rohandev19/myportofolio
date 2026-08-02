"use client";

import { FallbackProps } from "react-error-boundary";

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#141418] text-[#f0f1f4] p-4 text-center">
      <h2 className="text-2xl font-bold text-[#D4D8E0] mb-4">Something went wrong</h2>
      <p className="text-[#7B8794] mb-6 max-w-md">
        An unexpected error occurred. This might be due to a temporary issue or an unsupported
        browser feature.
      </p>
      <div className="bg-[#1a1a20] p-4 rounded-md text-sm text-left font-mono overflow-auto max-w-2xl w-full mb-8 text-[#ef4444]">
        {error instanceof Error ? error.message : String(error)}
      </div>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-[#D4D8E0] text-[#141418] font-semibold rounded-lg hover:bg-[#7B8794] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B8794]"
      >
        Try again
      </button>
    </div>
  );
}
