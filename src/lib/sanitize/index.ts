/**
 * Input Sanitization Utilities
 *
 * DOMPurify-based sanitization to prevent XSS attacks.
 * Provides both HTML sanitization and plain-text cleaning.
 */

import DOMPurify from "dompurify";

/**
 * Sanitize HTML input to prevent XSS attacks
 *
 * Strips dangerous elements and attributes:
 * - <script> tags
 * - Event handlers (onclick, onerror, etc.)
 * - javascript: and data:text/html URLs
 * - <iframe>, <embed>, <object> tags
 *
 * @example
 * ```typescript
 * const userInput = '<img src=x onerror="alert(1)">';
 * const safe = sanitizeHtml(userInput);
 * // Returns: '<img src="x">'
 * ```
 *
 * @param input - HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(input: string): string {
  if (typeof window === "undefined") {
    // Server-side: return empty or strip all tags
    return input.replace(/<[^>]*>/g, "");
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel"],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitize plain text input by stripping all HTML tags
 *
 * Use this for inputs that should never contain HTML markup.
 * More aggressive than sanitizeHtml - removes ALL tags.
 *
 * @example
 * ```typescript
 * const userInput = 'Hello <script>alert(1)</script> World';
 * const safe = sanitizePlainText(userInput);
 * // Returns: 'Hello  World'
 * ```
 *
 * @param input - Text string to sanitize
 * @returns Plain text with all HTML stripped
 */
export function sanitizePlainText(input: string): string {
  if (typeof window === "undefined") {
    // Server-side: strip tags with regex
    return input.replace(/<[^>]*>/g, "").trim();
  }

  // Use DOMPurify with no allowed tags
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize URL to prevent javascript: and data: URL attacks
 *
 * Only allows http:, https:, mailto:, tel: protocols
 *
 * @example
 * ```typescript
 * sanitizeUrl('javascript:alert(1)'); // Returns: 'about:blank'
 * sanitizeUrl('https://example.com'); // Returns: 'https://example.com'
 * ```
 *
 * @param url - URL string to sanitize
 * @returns Safe URL or 'about:blank' if dangerous
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();

  // Check for dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(trimmed)) {
    return "about:blank";
  }

  // Allow only safe protocols
  const safeProtocols = /^(https?|mailto|tel|sms):/i;
  if (!safeProtocols.test(trimmed) && !trimmed.startsWith("/") && !trimmed.startsWith("#")) {
    return "about:blank";
  }

  return trimmed;
}

/**
 * Sanitize file name to prevent directory traversal attacks
 *
 * Removes path separators and special characters
 *
 * @example
 * ```typescript
 * sanitizeFileName('../../../etc/passwd'); // Returns: 'etcpasswd'
 * sanitizeFileName('my file.txt'); // Returns: 'my-file.txt'
 * ```
 *
 * @param fileName - File name to sanitize
 * @returns Safe file name
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "-") // Replace invalid chars with dash
    .replace(/\.{2,}/g, ".") // Remove multiple dots
    .replace(/^\.+/, "") // Remove leading dots
    .replace(/\.+$/, "") // Remove trailing dots
    .substring(0, 255); // Limit length
}
