"use client";

/**
 * Toast Container
 *
 * Portal container for rendering toast notifications.
 * Stacks multiple toasts vertically.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useUIStore } from "@/store/ui.store";
import { Toast } from "./Toast";

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use microtask to avoid synchronous setState in effect
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>,
    document.body
  );
}
