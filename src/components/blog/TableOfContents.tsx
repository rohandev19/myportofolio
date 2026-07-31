"use client";

/**
 * Table of Contents Component
 *
 * Sidebar navigation with hierarchical headings.
 * Highlights current section via IntersectionObserver.
 *
 * @module components/blog/TableOfContents
 */

import { useState, useEffect } from "react";
import type { TOCItem } from "@/types";

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = items.flatMap(function flatten(item: TOCItem): string[] {
      return [item.id, ...item.children.flatMap(flatten)];
    });

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    for (const id of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      // Update URL hash without scrolling
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav
      className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
      aria-label="Table of contents"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
        On this page
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <TOCItemComponent key={item.id} item={item} activeId={activeId} onClick={handleClick} />
        ))}
      </ul>
    </nav>
  );
}

function TOCItemComponent({
  item,
  activeId,
  onClick,
  depth = 0,
}: {
  item: TOCItem;
  activeId: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  depth?: number;
}) {
  const isActive = activeId === item.id;

  return (
    <li>
      <a
        href={`#${item.id}`}
        onClick={(e) => onClick(e, item.id)}
        className={`block py-1.5 text-sm transition-all duration-200 border-l-2 ${
          isActive
            ? "border-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)] font-medium"
            : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500"
        }`}
        style={{ paddingLeft: `${(depth + 1) * 12}px` }}
        aria-current={isActive ? "location" : undefined}
      >
        {item.text}
      </a>
      {item.children.length > 0 && (
        <ul>
          {item.children.map((child) => (
            <TOCItemComponent
              key={child.id}
              item={child}
              activeId={activeId}
              onClick={onClick}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
