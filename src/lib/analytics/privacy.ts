/**
 * Privacy-First Analytics Collection
 *
 * Collects analytics without cookies, PII, or IP addresses.
 * Uses session fingerprinting based on daily rotating hashes.
 *
 * @module lib/analytics/privacy
 */

import { getSessionFingerprint } from "./fingerprint";

/**
 * Privacy-safe page view event
 */
export interface PrivacyPageView {
  path: string;
  referrer: string; // domain only, no full URL
  userAgentType: string; // browser category only
  timestamp: number;
  sessionId: string;
}

/**
 * Extract only the domain from a referrer URL (privacy-safe)
 */
export function sanitizeReferrer(referrer: string): string {
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return "unknown";
  }
}

/**
 * Categorize user agent into broad categories (no fingerprinting)
 */
export function categorizeUserAgent(ua: string): string {
  const lower = ua.toLowerCase();
  if (lower.includes("chrome") && !lower.includes("edg")) return "Chrome";
  if (lower.includes("firefox")) return "Firefox";
  if (lower.includes("safari") && !lower.includes("chrome")) return "Safari";
  if (lower.includes("edg")) return "Edge";
  if (lower.includes("opera") || lower.includes("opr")) return "Opera";
  return "Other";
}

/**
 * Create a privacy-safe page view event
 *
 * - No cookies
 * - No IP address
 * - No PII
 * - Referrer reduced to domain only
 * - User agent reduced to browser category only
 */
export function createPrivacyPageView(path: string): PrivacyPageView {
  return {
    path,
    referrer: typeof document !== "undefined" ? sanitizeReferrer(document.referrer) : "direct",
    userAgentType:
      typeof navigator !== "undefined" ? categorizeUserAgent(navigator.userAgent) : "unknown",
    timestamp: Date.now(),
    sessionId: getSessionFingerprint(),
  };
}

/**
 * Verify that an analytics payload contains no PII
 *
 * Checks that no IP addresses, emails, or other PII patterns exist.
 * Used as a safety guard before sending data.
 */
export function containsNoPII(data: Record<string, unknown>): boolean {
  const serialized = JSON.stringify(data);

  // Check for IP address patterns
  const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
  if (ipPattern.test(serialized)) return false;

  // Check for email patterns
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailPattern.test(serialized)) return false;

  return true;
}
