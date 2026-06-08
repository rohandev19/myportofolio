/**
 * UI Store
 *
 * Global UI state management for toasts, modals, and command palette.
 */

import { create } from "zustand";
import type { Toast } from "@/types/analytics.types";

interface UIStore {
  // Toast management
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  // Global loading
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIStore>((set) => ({
  // Toast state
  toasts: [],

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: `toast-${toastIdCounter++}`,
          duration: toast.duration || 3000,
        },
      ],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  // Command Palette state
  commandPaletteOpen: false,

  openCommandPalette: () => {
    set({ commandPaletteOpen: true });
    // Disable background scrolling
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  },

  closeCommandPalette: () => {
    set({ commandPaletteOpen: false });
    // Re-enable background scrolling
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  },

  // Page loading state
  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),
}));
