/**
 * Case Study Section Component
 *
 * Renders a standard section of a case study (Problem, Solution, Impact, Results)
 * with a title and Markdown content parsed securely.
 *
 * @module components/case-study/CaseStudySection
 */

import { compileMDX } from "next-mdx-remote/rsc";
import { secureMDXContent } from "@/lib/mdx/security";
import { mdxComponents } from "@/components/blog/MDXComponents";
import type { CaseStudySection as CaseStudySectionType } from "@/types";

interface CaseStudySectionProps {
  section: CaseStudySectionType;
  id?: string;
  className?: string;
}

export async function CaseStudySection({ section, id, className = "" }: CaseStudySectionProps) {
  if (!section.content) return null;

  const safeContent = secureMDXContent(section.content);

  const { content: mdxContent } = await compileMDX({
    source: safeContent,
    components: mdxComponents,
  });

  return (
    <section id={id} className={`my-12 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-6">
        {section.title}
      </h2>
      <div className="prose-custom">{mdxContent}</div>
    </section>
  );
}
