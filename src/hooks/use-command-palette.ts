/**
 * useCommandPalette Hook
 *
 * Handles keyboard shortcut (Ctrl+K / ⌘K) to open/close Command Palette.
 * Also manages scroll lock when palette is open.
 */

"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui.store";

export function useCommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const openPalette = useUIStore((s) => s.openCommandPalette);
  const closePalette = useUIStore((s) => s.closeCommandPalette);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or ⌘K to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
      }

      // Escape to close
      if (e.key === "Escape" && open) {
        e.preventDefault();
        closePalette();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openPalette, closePalette]);

  return { isOpen: open, open: openPalette, close: closePalette };
}
