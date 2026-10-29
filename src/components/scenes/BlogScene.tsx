import { parseAllArticles } from "@/lib/mdx/parser";
import { getAllTags } from "@/lib/mdx/search";
import { BlogListClient } from "@/app/blog/BlogListClient";

export function BlogScene() {
  const articles = parseAllArticles();
  const allTags = getAllTags(articles);
  const articleMetadata = articles.map((a) => a.metadata);

  return (
    <section
      id="blog"
      aria-label="Blog articles"
      className="min-h-screen w-full py-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden bg-[var(--color-bg-primary)]"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <BlogListClient articles={articleMetadata} allTags={allTags} />
      </div>
    </section>
  );
}
