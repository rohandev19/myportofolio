/**
 * Blog Article Detail Page
 *
 * Renders individual MDX blog posts with TOC, reading progress,
 * and related articles. Uses ISR with 1-hour revalidation.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { parseMDXFile, parseAllArticles, getAllArticleSlugs } from "@/lib/mdx/parser";
import { generateTOC } from "@/lib/mdx/toc";
import { getRelatedArticles } from "@/lib/mdx/related";
import { secureMDXContent } from "@/lib/mdx/security";
import { mdxComponents } from "@/components/blog/MDXComponents";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

export const revalidate = 3600; // 1 hour ISR

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = parseMDXFile(slug);
    return {
      title: `${article.metadata.title} | Blog`,
      description: article.metadata.description,
      openGraph: {
        title: article.metadata.title,
        description: article.metadata.description,
        type: "article",
        publishedTime: article.metadata.date,
        modifiedTime: article.metadata.updatedAt,
        authors: [article.metadata.author],
        tags: article.metadata.tags,
      },
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let article;

  try {
    article = parseMDXFile(slug);
  } catch {
    notFound();
  }

  // Security: sanitize content
  const safeContent = secureMDXContent(article.content);

  // Generate TOC from content
  const toc = generateTOC(article.content);

  // Get related articles
  const allArticles = parseAllArticles();
  const relatedArticles = getRelatedArticles(article.metadata, allArticles);

  // Compile MDX to React components
  const { content: mdxContent } = await compileMDX({
    source: safeContent,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
  });

  return (
    <>
      <ReadingProgress />

      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          {/* Main Content */}
          <div className="min-w-0">
            <ArticleHeader metadata={article.metadata} />

            {/* MDX Content */}
            <div className="prose-custom">{mdxContent}</div>

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} />
          </div>

          {/* Sidebar TOC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <TableOfContents items={toc} />
            </aside>
          )}
        </div>
      </article>
    </>
  );
}
