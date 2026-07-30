"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/store/ui.store";
import type { Toast as ToastType } from "@/types/analytics.types";
import gsap from "gsap";
import { withReducedMotion } from "@/lib/animations/reduced-motion";

interface ToastProps {
  toast: ToastType;
}

const toastStyles = {
  success: "bg-green-500/10 border-green-500/20 text-green-400",
  error: "bg-red-500/10 border-red-500/20 text-red-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
};

const toastIcons = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

export function Toast({ toast }: ToastProps) {
  const dismissToast = useUIStore((state) => state.dismissToast);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toastRef.current) return;

    // Slide in from top with bounce
    gsap.fromTo(
      toastRef.current,
      withReducedMotion({ y: -20, opacity: 0 }),
      withReducedMotion({
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      })
    );

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      if (toastRef.current) {
        gsap.to(
          toastRef.current,
          withReducedMotion({
            y: -10,
            opacity: 0,
            duration: 0.3,
            onComplete: () => dismissToast(toast.id),
          })
        );
      }
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dismissToast]);

  return (
    <div
      ref={toastRef}
      role="status"
      aria-live="polite"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border
        backdrop-blur-sm shadow-lg min-w-[300px] max-w-[500px]
        ${toastStyles[toast.type]}
      `}
    >
      <span className="text-xl" aria-hidden="true">
        {toastIcons[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => dismissToast(toast.id)}
        className="text-current hover:opacity-70 transition-opacity"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
