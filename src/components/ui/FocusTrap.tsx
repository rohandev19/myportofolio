"use client";

/**
 * Focus Trap Component
 *
 * Wraps content and traps keyboard focus within it.
 * Used for modal dialogs, command palette, etc.
 * Implements Tab/Shift+Tab cycling within container.
 */

import { useRef, type ReactNode } from "react";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface FocusTrapProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

export function FocusTrap({ children, isActive = true, className }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, isActive);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
