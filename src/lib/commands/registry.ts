/**
 * Command Registry
 *
 * Central registry of all available commands for the Command Palette.
 * Commands are categorized into navigation, settings, and themes.
 */

import type { Command } from "@/types/command-palette.types";

/**
 * Create the command registry with runtime actions.
 * Actions need runtime references (scroll, theme store) so they're
 * injected at initialization time.
 */
export function createCommandRegistry(actions: {
  scrollToSection: (sectionId: string) => void;
  setTheme: (theme: "dark" | "light" | "system") => void;
  navigateTo?: (path: string) => void;
}): Command[] {
  return [
    // --- Navigation Commands ---
    {
      id: "nav-hero",
      label: "Go to Hero",
      description: "Navigate to the hero section",
      category: "navigation",
      keywords: ["home", "top", "hero", "intro"],
      action: () => actions.scrollToSection("hero"),
    },
    {
      id: "nav-about",
      label: "Go to About",
      description: "Navigate to the about section",
      category: "navigation",
      keywords: ["about", "bio", "info", "me"],
      action: () => actions.scrollToSection("about"),
    },
    {
      id: "nav-timeline",
      label: "Go to Timeline",
      description: "Navigate to the career timeline",
      category: "navigation",
      keywords: ["timeline", "journey", "career", "experience", "work"],
      action: () => actions.scrollToSection("timeline"),
    },
    {
      id: "nav-tech",
      label: "Go to Tech Galaxy",
      description: "Navigate to the technology stack",
      category: "navigation",
      keywords: ["tech", "stack", "skills", "galaxy", "technology"],
      action: () => actions.scrollToSection("tech-galaxy"),
    },
    {
      id: "nav-philosophy",
      label: "Go to Philosophy",
      description: "Navigate to engineering philosophy",
      category: "navigation",
      keywords: ["philosophy", "principles", "values"],
      action: () => actions.scrollToSection("philosophy"),
    },
    {
      id: "nav-showcase",
      label: "Go to Showcase",
      description: "Navigate to project showcase",
      category: "navigation",
      keywords: ["projects", "showcase", "portfolio", "work"],
      action: () => actions.scrollToSection("projects"),
    },
    {
      id: "nav-contact",
      label: "Go to Contact",
      description: "Navigate to the contact section",
      category: "navigation",
      keywords: ["contact", "email", "message", "reach"],
      action: () => actions.scrollToSection("contact"),
    },
    {
      id: "nav-blog",
      label: "Go to Blog",
      description: "Read my latest articles and thoughts",
      category: "navigation",
      keywords: ["blog", "articles", "writing", "posts", "read"],
      action: () => actions.navigateTo?.("/blog"),
    },
    {
      id: "nav-analytics",
      label: "Go to Analytics",
      description: "View website performance metrics",
      category: "navigation",
      keywords: ["analytics", "metrics", "dashboard", "stats", "performance"],
      action: () => actions.navigateTo?.("/dashboard/analytics"),
    },

    // --- Settings Commands ---
    {
      id: "toggle-theme",
      label: "Toggle Theme",
      description: "Switch between dark and light mode",
      category: "settings",
      keywords: ["theme", "dark", "light", "toggle", "mode"],
      shortcut: ["T"],
      action: () => {
        // Toggle will be handled by the palette component
        const html = document.documentElement;
        const current = html.getAttribute("data-theme");
        actions.setTheme(current === "dark" ? "light" : "dark");
      },
    },

    // --- Theme Commands ---
    {
      id: "theme-dark",
      label: "Dark Mode",
      description: "Switch to dark mode",
      category: "themes",
      keywords: ["dark", "night", "theme"],
      action: () => actions.setTheme("dark"),
    },
    {
      id: "theme-light",
      label: "Light Mode",
      description: "Switch to light mode",
      category: "themes",
      keywords: ["light", "day", "theme", "bright"],
      action: () => actions.setTheme("light"),
    },
    {
      id: "theme-system",
      label: "System Theme",
      description: "Follow system preference",
      category: "themes",
      keywords: ["system", "auto", "preference", "os"],
      action: () => actions.setTheme("system"),
    },
  ];
}
