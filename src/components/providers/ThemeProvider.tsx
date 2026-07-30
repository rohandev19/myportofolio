"use client";

/**
 * Theme Provider
 *
 * Client-side theme management with anti-flash protection.
 * Syncs with system preference when theme is set to 'system'.
 */

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initialize = useThemeStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

/**
 * useTheme Hook
 *
 * Hook for accessing and modifying theme state.
 */
export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
}
