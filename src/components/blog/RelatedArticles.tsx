"use client";

/**
 * Related Articles Component
 *
 * Grid of related article cards shown at the bottom of an article
 * with Framer Motion repeated scroll-reveal animations.
 *
 * @module components/blog/RelatedArticles
 */

import { motion } from "framer-motion";
import type { ArticleMetadata } from "@/types";
import { viewportConfig, cardFadeUp } from "@/lib/animations/motion";
import { ArticleCard } from "./ArticleCard";

interface RelatedArticlesProps {
  articles: ArticleMetadata[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <motion.section
      className="mt-16 pt-12 border-t border-[var(--color-border)]"
      aria-label="Related articles"
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={cardFadeUp}
    >
      <h2 className="text-2xl font-serif font-normal text-[var(--color-text-primary)] mb-8">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{
              duration: 0.5,
              delay: (idx % 3) * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
