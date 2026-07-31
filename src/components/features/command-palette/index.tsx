"use client";

/**
 * Command Palette — Compound Component
 *
 * Full-featured command palette with fuzzy search, keyboard navigation,
 * grouped results, and smooth animations.
 *
 * Usage:
 *   <CommandPalette />
 * Placed once in the layout; controlled via useCommandPalette() hook.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useUIStore } from "@/store/ui.store";
import { useThemeStore } from "@/store/theme.store";
import { createCommandRegistry } from "@/lib/commands/registry";
import { fuzzySearch } from "@/lib/search/fuzzy-search";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import type { Command, CommandCategory } from "@/types/command-palette.types";

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigation: "Navigation",
  actions: "Actions",
  settings: "Settings",
  themes: "Themes",
};

const CATEGORY_ORDER: CommandCategory[] = ["navigation", "settings", "themes", "actions"];

export function CommandPalette() {
  const isOpen = useUIStore((s) => s.commandPaletteOpen);
  const closePalette = useUIStore((s) => s.closeCommandPalette);
  const setTheme = useThemeStore((s) => s.setTheme);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useFocusTrap(dialogRef, isOpen);

  // Ensure portal renders client-side only
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Scroll to section helper
  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Build command registry
  const router = useRouter();

  const commands = useMemo(
    () =>
      createCommandRegistry({
        scrollToSection,
        setTheme,
        navigateTo: (path) => router.push(path),
      }),
    [scrollToSection, setTheme, router]
  );

  // Filter commands based on query
  const filteredCommands = useMemo((): Command[] => {
    if (!query.trim()) return commands;

    const results = fuzzySearch(
      commands,
      ["label", "description", "keywords"] as (keyof Command)[],
      query,
      { threshold: 2 }
    );

    return results.map((r) => r.item);
  }, [commands, query]);

  // Group filtered commands by category
  const groupedCommands = useMemo(() => {
    const groups = new Map<CommandCategory, Command[]>();

    for (const cmd of filteredCommands) {
      const existing = groups.get(cmd.category) || [];
      existing.push(cmd);
      groups.set(cmd.category, existing);
    }

    // Return in order
    return CATEGORY_ORDER.filter((cat) => groups.has(cat)).map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      commands: groups.get(cat)!,
    }));
  }, [filteredCommands]);

  // Flatten for keyboard navigation
  const flatCommands = useMemo(() => groupedCommands.flatMap((g) => g.commands), [groupedCommands]);

  // Reset selection when query changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");

      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      // Slight delay to ensure DOM is ready
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Execute selected command
  const executeCommand = useCallback(
    (command: Command) => {
      closePalette();
      // Execute after palette closes for smooth transition
      requestAnimationFrame(() => {
        command.action();
      });
    },
    [closePalette]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
          break;
        case "Enter":
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            executeCommand(flatCommands[selectedIndex]);
          }
          break;
      }
    },
    [flatCommands, selectedIndex, executeCommand]
  );

  // Backdrop click handler
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        closePalette();
      }
    },
    [closePalette]
  );

  if (!mounted || !isOpen) return null;

  const palette = (
    <div
      className="fixed inset-0 z-[9998] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="w-full max-w-xl mx-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden animate-[scaleIn_150ms_ease-out]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
          <svg
            className="w-5 h-5 text-[var(--color-text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none text-base"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] rounded border border-[var(--color-border)]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          className="max-h-[300px] overflow-y-auto py-2"
          role="listbox"
          aria-label="Command results"
        >
          {groupedCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-[var(--color-text-tertiary)] text-sm">
              No commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            groupedCommands.map((group) => (
              <div key={group.category}>
                <div className="px-4 py-1.5 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                  {group.label}
                </div>
                {group.commands.map((command) => {
                  const globalIndex = flatCommands.indexOf(command);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={command.id}
                      role="option"
                      aria-selected={isSelected}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]"
                          : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                      }`}
                      onClick={() => executeCommand(command)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{command.label}</span>
                        {command.description && (
                          <span className="text-xs text-[var(--color-text-tertiary)]">
                            {command.description}
                          </span>
                        )}
                      </div>
                      {command.shortcut && (
                        <div className="flex gap-1">
                          {command.shortcut.map((key) => (
                            <kbd
                              key={key}
                              className="px-1.5 py-0.5 text-xs font-mono bg-[var(--color-bg-secondary)] rounded border border-[var(--color-border)] text-[var(--color-text-tertiary)]"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-2 border-t border-[var(--color-border)] flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-bg-secondary)] rounded border border-[var(--color-border)] text-[10px]">
              ↑↓
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-bg-secondary)] rounded border border-[var(--color-border)] text-[10px]">
              ↵
            </kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-bg-secondary)] rounded border border-[var(--color-border)] text-[10px]">
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(palette, document.body);
}
