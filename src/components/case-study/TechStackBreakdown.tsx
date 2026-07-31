/**
 * Tech Stack Breakdown Component
 *
 * Displays technologies used in a case study, grouped by category.
 *
 * @module components/case-study/TechStackBreakdown
 */

import type { TechStackItem, TechCategory } from "@/types";

interface TechStackBreakdownProps {
  techStack: TechStackItem[];
}

export function TechStackBreakdown({ techStack }: TechStackBreakdownProps) {
  if (!techStack || techStack.length === 0) return null;

  // Group by category
  const grouped = techStack.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<TechCategory, TechStackItem[]>
  );

  return (
    <section className="my-16" aria-labelledby="tech-stack-heading">
      <h2 id="tech-stack-heading" className="text-2xl font-bold text-white mb-8">
        Technology Stack
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-[var(--color-accent-cyan)] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {category}
            </h3>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.name} className="flex flex-col">
                  <span className="font-medium text-white mb-1">{item.name}</span>
                  {item.explanation && (
                    <span className="text-sm text-slate-400 leading-relaxed">
                      {item.explanation}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
