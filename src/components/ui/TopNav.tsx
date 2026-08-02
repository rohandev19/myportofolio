"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();

  // Only show the top nav on sub-pages (not the home page)
  if (pathname === "/") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#141418]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4D8E0] to-[#1A4A4E]"
        >
          Rohan.
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-[#5A6677] hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link
            href="/blog"
            className={`transition-colors ${pathname.startsWith("/blog") ? "text-[#D4D8E0]" : "text-[#5A6677] hover:text-white"}`}
          >
            Blog
          </Link>
          <Link
            href="/dashboard/analytics"
            className={`transition-colors ${pathname.startsWith("/dashboard") ? "text-[#D4D8E0]" : "text-[#5A6677] hover:text-white"}`}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
