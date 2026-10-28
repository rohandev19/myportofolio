"use client";

/**
 * Article Header Component
 *
 * Displays article metadata: author, date, reading time, cover image.
 * Shows "Last updated" when applicable with Framer Motion entry animations.
 *
 * @module components/blog/ArticleHeader
 */

import Image from "next/image";
import { motion } from "framer-motion";
import type { ArticleMetadata } from "@/types";
import { cardFadeUp } from "@/lib/animations/motion";

interface ArticleHeaderProps {
  metadata: ArticleMetadata;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleHeader({ metadata }: ArticleHeaderProps) {
  return (
    <motion.header className="mb-12" initial="hidden" animate="visible" variants={cardFadeUp}>
      {/* Tags */}
      {metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {metadata.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] border border-[var(--color-accent-blue)]/20 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-[var(--color-text-primary)] leading-tight mb-6">
        {metadata.title}
      </h1>

      {/* Description */}
      <p className="text-lg text-[var(--color-text-secondary)] mb-6 max-w-2xl leading-relaxed">
        {metadata.description}
      </p>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-violet)] flex items-center justify-center text-[var(--color-bg-primary)] text-xs font-bold">
            {metadata.author.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-[var(--color-text-primary)]">{metadata.author}</span>
        </div>

        <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />

        <time dateTime={metadata.date}>{formatDate(metadata.date)}</time>

        <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />

        <span>{metadata.readTime} min read</span>

        <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />

        <span>{metadata.wordCount.toLocaleString()} words</span>

        {metadata.updatedAt && (
          <>
            <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
            <span className="text-[var(--color-text-tertiary)]">
              Last updated: {formatDate(metadata.updatedAt)}
            </span>
          </>
        )}
      </div>

      {/* Cover Image */}
      {metadata.coverImage && (
        <motion.div
          className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--color-border)]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Image
            src={metadata.coverImage}
            alt={metadata.coverImageAlt || metadata.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </motion.div>
      )}
    </motion.header>
  );
}
