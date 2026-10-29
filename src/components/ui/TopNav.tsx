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
    ? "bg-transparent border-transparent py-7 sm:py-8"
    : isDark
      ? "bg-[#141418]/95 backdrop-blur-md border-b border-white/10 shadow-md py-4 sm:py-5"
      : "bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm py-4 sm:py-5";

  const linkColor = !showSolidBar
    ? "text-white/90 hover:text-white"
    : isDark
      ? "text-[#f0f1f4]/85 hover:text-white"
      : "text-neutral-700 hover:text-black";

  const toggleBtnColor = !showSolidBar
    ? "text-white/90 hover:text-white hover:bg-white/10"
    : isDark
      ? "text-[#f0f1f4] hover:text-white hover:bg-white/10"
      : "text-neutral-800 hover:text-black hover:bg-black/5";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 transition-all duration-300 ${headerStyle}`}
    >
      <div className="max-w-6xl mx-auto relative flex items-center justify-center">
        <nav
          aria-label="Primary Navigation"
          className="flex items-center gap-4 sm:gap-8 md:gap-10 text-[11px] sm:text-xs font-sans font-normal tracking-[0.22em] uppercase overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-10 sm:pr-0"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-colors duration-200 ${linkColor}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Enlarged Theme Toggle Button on Right */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`absolute right-0 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none ${toggleBtnColor}`}
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 sm:w-6 sm:h-6"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 sm:w-6 sm:h-6"
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
