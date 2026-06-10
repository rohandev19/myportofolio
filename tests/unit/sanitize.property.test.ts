/**
 * Property 16: XSS Sanitization Safety
 *
 * Validates: Requirements 11.12
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { sanitizeHtml, sanitizePlainText, sanitizeUrl, sanitizeFileName } from "@/lib/sanitize";

describe("Property 16: XSS Sanitization Safety", () => {
  it("should remove script tags from HTML", () => {
    const testCases = [
      "<script>alert(1)</script>",
      '<img src=x onerror="alert(1)">',
      '<a href="javascript:alert(1)">Click</a>',
      '<div onclick="alert(1)">Click</div>',
    ];

    testCases.forEach((malicious) => {
      const sanitized = sanitizeHtml(malicious);

      // Should not contain dangerous content
      expect(sanitized.toLowerCase()).not.toContain("<script");
      expect(sanitized.toLowerCase()).not.toContain("javascript:");
      expect(sanitized.toLowerCase()).not.toContain("onerror");
      expect(sanitized.toLowerCase()).not.toContain("onclick");
    });
  });

  it("should remove event handlers", () => {
    const handlers = ["onclick", "onerror", "onload"];

    handlers.forEach((handler) => {
      const malicious = `<div ${handler}="alert(1)">test</div>`;
      const sanitized = sanitizeHtml(malicious);
      expect(sanitized.toLowerCase()).not.toContain(handler);
    });
  });

  it("should preserve safe HTML content", () => {
    const safeHtml = "<p>Hello <strong>world</strong></p>";
    const sanitized = sanitizeHtml(safeHtml);

    expect(sanitized).toContain("<p>");
    expect(sanitized).toContain("<strong>");
    expect(sanitized).toContain("Hello");
    expect(sanitized).toContain("world");
  });

  it("should allow safe links with http/https", () => {
    const safeUrls = ["http://example.com", "https://example.com/path", "https://sub.example.com"];

    safeUrls.forEach((url) => {
      const html = `<a href="${url}">Link</a>`;
      const sanitized = sanitizeHtml(html);

      expect(sanitized).toContain("href=");
      expect(sanitized).toContain("<a");
      expect(sanitized).toContain("</a>");
    });
  });
});

describe("sanitizePlainText", () => {
  it("should strip all HTML tags", () => {
    const testCases = [
      { input: "<div>Hello</div>", expected: "Hello" },
      { input: "<p><span>Test</span></p>", expected: "Test" },
      { input: "<script>alert(1)</script>", expected: "" },
      { input: "Plain text", expected: "Plain text" },
    ];

    testCases.forEach(({ input, expected }) => {
      const sanitized = sanitizePlainText(input);
      expect(sanitized.trim()).toBe(expected.trim());
    });
  });

  it("should handle nested tags", () => {
    const input = "<div><p><span>Hello</span></p></div>";
    const sanitized = sanitizePlainText(input);

    expect(sanitized).toBe("Hello");
    expect(sanitized).not.toContain("<");
    expect(sanitized).not.toContain(">");
  });

  it("should preserve plain text unchanged", () => {
    const plainTexts = ["Hello world", "Test 123", "Special chars: !@#$%"];

    plainTexts.forEach((text) => {
      const sanitized = sanitizePlainText(text);
      expect(sanitized.trim()).toBe(text.trim());
    });
  });
});

describe("sanitizeUrl", () => {
  it("should block javascript: URLs", () => {
    const maliciousUrls = ["javascript:alert(1)", "JAVASCRIPT:alert(1)", "javascript:void(0)"];

    maliciousUrls.forEach((url) => {
      const sanitized = sanitizeUrl(url);
      expect(sanitized).toBe("about:blank");
    });
  });

  it("should block data: URLs", () => {
    const maliciousUrls = [
      "data:text/html,<script>alert(1)</script>",
      "data:text/javascript,alert(1)",
    ];

    maliciousUrls.forEach((url) => {
      const sanitized = sanitizeUrl(url);
      expect(sanitized).toBe("about:blank");
    });
  });

  it("should allow safe http/https URLs", () => {
    const safeUrls = ["http://example.com", "https://example.com/path", "https://sub.example.com"];

    safeUrls.forEach((url) => {
      const sanitized = sanitizeUrl(url);
      expect(sanitized).toBe(url);
    });
  });

  it("should allow mailto and tel URLs", () => {
    const safeUrls = ["mailto:test@example.com", "tel:+1234567890", "sms:+1234567890"];

    safeUrls.forEach((url) => {
      const sanitized = sanitizeUrl(url);
      expect(sanitized).toBe(url);
    });
  });

  it("should allow relative URLs", () => {
    const relativeUrls = ["/page", "/path/to/resource", "#section"];

    relativeUrls.forEach((url) => {
      const sanitized = sanitizeUrl(url);
      expect(sanitized).toBe(url);
    });
  });
});

describe("sanitizeFileName", () => {
  it("should remove path separators", () => {
    const malicious = "../../../etc/passwd";
    const sanitized = sanitizeFileName(malicious);

    expect(sanitized).not.toContain("/");
    expect(sanitized).not.toContain("\\");
    expect(sanitized).not.toContain("..");
  });

  it("should handle file names safely", () => {
    const testCases = [
      { input: "normal-file.txt", shouldContainDash: true },
      { input: "../danger/file.txt", shouldNotContain: ["/", ".."] },
      { input: "file with spaces.txt", expected: "file-with-spaces.txt" },
    ];

    testCases.forEach(({ input }) => {
      const sanitized = sanitizeFileName(input);

      // Should not contain dangerous characters
      expect(sanitized).not.toContain("/");
      expect(sanitized).not.toContain("\\");
      expect(sanitized.length).toBeLessThanOrEqual(255);
    });
  });

  it("should replace spaces with dashes", () => {
    const input = "my file name.txt";
    const sanitized = sanitizeFileName(input);

    expect(sanitized).toBe("my-file-name.txt");
  });

  it("should remove leading and trailing dots", () => {
    const input = "...test...";
    const sanitized = sanitizeFileName(input);

    expect(sanitized).not.toMatch(/^\./);
    expect(sanitized).not.toMatch(/\.$/);
  });
});
