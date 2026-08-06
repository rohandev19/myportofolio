/**
 * Article Card Component
 *
 * Blog post preview card for the listing page.
 * Displays cover image, title, description, tags, date, and reading time.
 *
 * @module components/blog/ArticleCard
 */

import Link from "next/link";
import Image from "next/image";
import type { ArticleMetadata } from "@/types";

interface ArticleCardProps {
  article: ArticleMetadata;
  featured?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className={`group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden transition-all duration-300 hover:border-[var(--color-accent-cyan)]/30 hover:shadow-lg hover:shadow-[var(--color-accent-cyan)]/5 hover:-translate-y-1 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs px-2.5 py-1 text-[var(--color-text-tertiary)]">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-cyan)] transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">
          {article.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
          <span>{article.readTime} min read</span>
          {article.category && (
            <>
              <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
              <span>{article.category}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
