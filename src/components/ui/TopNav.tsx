"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";

const NAV_LINKS = [
  { label: "HOME", href: "/#hero" },
  { label: "PORTFOLIO", href: "/#projects" },
  { label: "RESUME", href: "/#timeline" },
  { label: "ABOUT", href: "/#about" },
  { label: "BLOG", href: "/#blog" },
  { label: "CONTACT", href: "/#contact" },
];

export function TopNav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show solid themed navbar when scrolled down or when on subpages
  const showSolidBar = isScrolled || pathname !== "/";

  const headerStyle = !showSolidBar
    ? "bg-transparent border-transparent py-3.5 sm:py-7"
    : isDark
      ? "bg-[#141418]/95 backdrop-blur-md border-b border-white/10 shadow-md py-2.5 sm:py-4"
      : "bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm py-2.5 sm:py-4";

  const linkColor = !showSolidBar
    ? "text-white/90 hover:text-white"
    : isDark
      ? "text-[#f0f1f4]/90 hover:text-white"
      : "text-neutral-700 hover:text-black";

  const toggleBtnColor = !showSolidBar
    ? "text-white/90 hover:text-white bg-white/10 sm:bg-transparent hover:bg-white/20"
    : isDark
      ? "text-[#f0f1f4] hover:text-white bg-white/5 sm:bg-transparent hover:bg-white/15"
      : "text-neutral-800 hover:text-black bg-black/5 sm:bg-transparent hover:bg-black/10";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-8 transition-all duration-300 ${headerStyle}`}
    >
      <div className="max-w-6xl mx-auto relative flex items-center justify-between sm:justify-center w-full gap-2">
        <nav
          aria-label="Primary Navigation"
          className="flex flex-1 sm:flex-initial items-center justify-between sm:justify-center gap-1 sm:gap-7 md:gap-10 text-[9.5px] sm:text-xs font-sans font-medium sm:font-normal tracking-[0.05em] sm:tracking-[0.2em] uppercase whitespace-nowrap min-w-0"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`!min-w-0 !min-h-0 inline-flex items-center justify-center py-1.5 px-0.5 leading-none transition-colors duration-200 ${linkColor}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`!min-w-0 !min-h-0 shrink-0 sm:absolute sm:right-0 md:right-4 sm:top-1/2 sm:-translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full inline-flex items-center justify-center transition-all duration-200 focus:outline-none ${toggleBtnColor}`}
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 sm:w-5 sm:h-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 sm:w-5 sm:h-5"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
