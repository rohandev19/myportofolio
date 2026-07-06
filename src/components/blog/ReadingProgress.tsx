"use client";

/**
 * Reading Progress Indicator
 *
 * Fixed top bar showing scroll progress through an article.
 * Uses requestAnimationFrame for jank-free updates.
 *
 * @module components/blog/ReadingProgress
 */

import { useState, useEffect } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const calcProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 0;
      return Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setProgress(calcProgress());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Use rAF for initial calculation (async, avoids lint warning)
    requestAnimationFrame(() => setProgress(calcProgress()));

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Reading progress: ${Math.round(progress)}%`}
    >
      <div
        className="h-full bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-violet)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
