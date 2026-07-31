"use client";

/**
 * Custom MDX Components
 *
 * Provides styled React components for rendering MDX content,
 * including syntax-highlighted code blocks and custom elements.
 *
 * @module components/blog/MDXComponents
 */

import React from "react";
import Image from "next/image";

/**
 * Syntax-highlighted code block component
 * Uses CSS classes for highlighting (Shiki highlights server-side)
 */
function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }) {
  const language = className?.replace("language-", "") || "text";

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
      {/* Language label */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          {language}
        </span>
        <CopyButton text={typeof children === "string" ? children : ""} />
      </div>
      <pre
        className={`overflow-x-auto p-4 text-sm leading-relaxed font-mono ${className || ""}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

/**
 * Copy to clipboard button for code blocks
 */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

/**
 * Inline code component
 */
function InlineCode({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className="px-1.5 py-0.5 rounded bg-white/10 text-[var(--color-accent-cyan)] text-sm font-mono border border-white/5"
      {...props}
    >
      {children}
    </code>
  );
}

/**
 * Custom image component with Next.js Image optimization
 */
function MDXImage({
  src,
  alt,
  width,
  height,
}: {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}) {
  if (!src || typeof src !== "string") return null;

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-xl border border-white/10">
        <Image
          src={src as string}
          alt={alt || ""}
          width={Number(width) || 800}
          height={Number(height) || 450}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
      {alt && (
        <figcaption className="mt-3 text-center text-sm text-slate-400 italic">{alt}</figcaption>
      )}
    </figure>
  );
}

/**
 * Callout/admonition component
 */
function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "tip" | "danger";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/5",
      icon: "ℹ️",
      titleColor: "text-blue-400",
    },
    warning: {
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/5",
      icon: "⚠️",
      titleColor: "text-yellow-400",
    },
    tip: {
      border: "border-green-500/30",
      bg: "bg-green-500/5",
      icon: "💡",
      titleColor: "text-green-400",
    },
    danger: {
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      icon: "🚨",
      titleColor: "text-red-400",
    },
  };

  const style = styles[type];

  return (
    <div className={`my-6 rounded-xl border-l-4 ${style.border} ${style.bg} p-4`} role="note">
      {title && (
        <p className={`font-semibold mb-2 ${style.titleColor} flex items-center gap-2`}>
          <span>{style.icon}</span> {title}
        </p>
      )}
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

/**
 * Link card for external resources
 */
function LinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-4 flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-[var(--color-accent-cyan)]/30 hover:bg-white/8"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white group-hover:text-[var(--color-accent-cyan)] transition-colors truncate">
          {title}
        </p>
        {description && <p className="mt-1 text-sm text-slate-400 line-clamp-2">{description}</p>}
      </div>
      <span className="text-slate-400 group-hover:text-[var(--color-accent-cyan)] transition-colors shrink-0">
        →
      </span>
    </a>
  );
}

/**
 * MDX component map for next-mdx-remote
 *
 * Maps standard HTML elements to custom styled components.
 */
export const mdxComponents = {
  // Code blocks
  pre: CodeBlock,
  code: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
    // If inside a pre tag (code block), render as-is
    if (className?.startsWith("language-")) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    // Inline code
    return <InlineCode {...props}>{children}</InlineCode>;
  },

  // Images
  img: MDXImage,

  // Headings with anchor links
  h2: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 id={id} className="text-2xl font-bold mt-12 mb-4 text-white scroll-mt-24 group" {...props}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Link to ${typeof children === "string" ? children : "section"}`}
        >
          #
        </a>
      )}
    </h2>
  ),
  h3: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={id}
      className="text-xl font-semibold mt-8 mb-3 text-white scroll-mt-24 group"
      {...props}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Link to ${typeof children === "string" ? children : "section"}`}
        >
          #
        </a>
      )}
    </h3>
  ),
  h4: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 id={id} className="text-lg font-semibold mt-6 mb-2 text-slate-200 scroll-mt-24" {...props}>
      {children}
    </h4>
  ),

  // Text elements
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 text-slate-300 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-white" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-slate-200" {...props}>
      {children}
    </em>
  ),

  // Links
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-violet)] underline underline-offset-2 transition-colors"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },

  // Lists
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-slate-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-slate-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-1 leading-relaxed" {...props}>
      {children}
    </li>
  ),

  // Blockquote
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-[var(--color-accent-violet)]/50 bg-white/5 pl-4 py-3 text-slate-300 italic rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  ),

  // Table
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border-b border-white/10 bg-white/5 px-4 py-3 text-left font-semibold text-white"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-white/5 px-4 py-3 text-slate-300" {...props}>
      {children}
    </td>
  ),

  // Custom components
  Callout,
  LinkCard,
};
