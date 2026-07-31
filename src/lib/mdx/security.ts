/**
 * MDX Content Security
 *
 * Sanitization utilities for MDX content to prevent XSS attacks.
 * Extends the existing sanitize utilities with MDX-specific processing.
 *
 * @module lib/mdx/security
 */

/**
 * Dangerous patterns to strip from content
 */
const DANGEROUS_PATTERNS = [
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi, // Event handlers
  /on\w+\s*=\s*\{[^}]*\}/gi, // JSX event handlers
  /javascript\s*:/gi, // javascript: URLs
  /data\s*:\s*text\/html/gi, // data: URLs
  /vbscript\s*:/gi, // vbscript: URLs
  /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
  /<embed\b[^>]*\/?>/gi,
  /<object\b[^>]*>[\s\S]*?<\/object>/gi,
  /<form\b[^>]*>[\s\S]*?<\/form>/gi,
];

/**
 * Sanitize MDX content by stripping dangerous HTML patterns
 *
 * @param content - Raw MDX content string
 * @returns Sanitized content with dangerous patterns removed
 */
export function sanitizeMDXContent(content: string): string {
  let sanitized = content;

  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }

  return sanitized;
}

/**
 * Add rel="noopener noreferrer" to external links in HTML content
 *
 * Only modifies links that point to external URLs (http:// or https://).
 * Internal links (starting with / or #) are left unchanged.
 *
 * @param html - HTML content string
 * @returns HTML with rel attributes added to external links
 */
export function addRelNoopener(html: string): string {
  return html.replace(
    /<a\s+([^>]*href\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*)>/gi,
    (match, attrs, _href) => {
      // Skip if rel already present
      if (/rel\s*=/i.test(attrs)) {
        return match;
      }
      return `<a ${attrs} rel="noopener noreferrer" target="_blank">`;
    }
  );
}

/**
 * Validate that a URL is safe to use in href attributes
 *
 * @param url - URL to validate
 * @returns true if the URL is safe
 */
export function isUrlSafe(url: string): boolean {
  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("file:")
  ) {
    return false;
  }

  return true;
}

/**
 * Process MDX content through the full security pipeline
 *
 * @param content - Raw MDX content
 * @returns Fully sanitized content
 */
export function secureMDXContent(content: string): string {
  let processed = sanitizeMDXContent(content);
  processed = addRelNoopener(processed);
  return processed;
}
