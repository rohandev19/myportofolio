"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "@/lib/error/monitor";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, {
      componentName: this.props.componentName || "UnknownComponent",
      stack: errorInfo.componentStack ? errorInfo.componentStack.toString() : undefined,
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 m-4 bg-[var(--color-bg-secondary)] border border-red-500/30 rounded-xl text-center max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            An unexpected error occurred in this section. We&apos;ve logged the issue.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-4 py-2 bg-[var(--color-bg-primary)] hover:bg-[var(--color-accent-blue)]/10 text-[var(--color-text-primary)] rounded-lg transition-colors border border-[var(--color-border)]"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
