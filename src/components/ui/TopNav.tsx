"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function TopNav() {
  const pathname = usePathname();

  // Only show the top nav on sub-pages (not the home page)
  if (pathname === "/") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4D8E0] to-[#1A4A4E]"
        >
          Rohan.
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/blog"
            className={`transition-colors ${pathname.startsWith("/blog") ? "text-[var(--color-accent-blue)]" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"}`}
          >
            Blog
          </Link>
          <a
            href="/dashboard/analytics"
            className={`transition-colors ${pathname.startsWith("/dashboard") ? "text-[var(--color-accent-blue)]" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"}`}
          >
            Dashboard
          </a>
          <Link
            href="/CV/CV_Muhammad_Rohan_Sayyid_FullstackDeveloper_EN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Resume
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border)]">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
