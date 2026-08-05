"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

/**
 * SiteControls
 *
 * Floating theme toggle for the homepage only. Sub-pages render the same
 * toggle inline inside `TopNav` instead, since that bar is hidden on the
 * homepage for an immersive hero section.
 */
export function SiteControls() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <div className="fixed top-4 right-4 z-[60] flex items-center gap-2">
      <ThemeToggle />
    </div>
  );
}
