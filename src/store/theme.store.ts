/**
 * Theme Store
 *
 * Zustand store for managing theme state with localStorage persistence.
 * Supports dark, light, and system preference modes.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeStore {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  initialize: () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  return theme === "system" ? getSystemTheme() : theme;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "dark",

      setTheme: (theme: Theme) => {
        const resolved = resolveTheme(theme);
        set({ theme, resolvedTheme: resolved });

        // Apply theme to HTML element
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", resolved);
        }
      },

      initialize: () => {
        const { theme } = get();
        const resolved = resolveTheme(theme);
        set({ resolvedTheme: resolved });

        // Apply theme immediately
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", resolved);
        }

        // Listen for system theme changes
        if (typeof window !== "undefined" && theme === "system") {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handleChange = () => {
            const newResolved = getSystemTheme();
            set({ resolvedTheme: newResolved });
            document.documentElement.setAttribute("data-theme", newResolved);
          };

          mediaQuery.addEventListener("change", handleChange);
        }
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
