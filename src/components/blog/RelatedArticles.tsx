/**
 * Related Articles Component
 *
 * Grid of related article cards shown at the bottom of an article.
 *
 * @module components/blog/RelatedArticles
 */

import type { ArticleMetadata } from "@/types";
import { ArticleCard } from "./ArticleCard";

interface RelatedArticlesProps {
  articles: ArticleMetadata[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/10" aria-label="Related articles">
      <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
