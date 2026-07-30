/**
 * Sliding Window Rate Limiter
 *
 * In-memory rate limiting for Edge Runtime compatibility.
 * Uses sliding window algorithm for accurate rate limiting.
 */

import type { RateLimitState } from "@/types/portfolio.types";

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests allowed in window
}

// In-memory storage (resets on server restart)
const rateLimitStore = new Map<string, RateLimitState>();

/**
 * Hash identifier for privacy (don't store raw IPs)
 *
 * Uses Web Crypto API (Edge Runtime compatible)
 *
 * @param identifier - Raw identifier (e.g., IP address)
 * @returns Hashed identifier
 */
async function hashIdentifier(identifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(identifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex.substring(0, 16);
}

/**
 * Clean up old entries from rate limit store
 *
 * Removes entries that are outside the current window
 */
function cleanupStore(windowMs: number): void {
  const now = Date.now();
  const cutoff = now - windowMs;

  for (const [key, state] of rateLimitStore.entries()) {
    // Remove entries with no recent requests
    const recentRequests = state.requests.filter((timestamp) => timestamp > cutoff);
    if (recentRequests.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check rate limit for identifier
 *
 * Uses sliding window algorithm:
 * - Maintains array of request timestamps
 * - Filters timestamps within current window
 * - Allows request if count < maxRequests
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   windowMs: 3600000, // 1 hour
 *   maxRequests: 3,
 * });
 *
 * const result = await limiter.checkRateLimit('user-ip-address');
 * if (!result.allowed) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 * ```
 *
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}> {
  const now = Date.now();
  const hashedId = await hashIdentifier(identifier);
  const windowStart = now - config.windowMs;

  // Cleanup old entries periodically (1% chance)
  if (Math.random() < 0.01) {
    cleanupStore(config.windowMs);
  }

  // Get or create rate limit state
  let state = rateLimitStore.get(hashedId);
  if (!state) {
    state = {
      requests: [],
      windowStart: now,
    };
    rateLimitStore.set(hashedId, state);
  }

  // Filter requests within current window (sliding window)
  state.requests = state.requests.filter((timestamp) => timestamp > windowStart);

  // Check if limit exceeded
  if (state.requests.length >= config.maxRequests) {
    const oldestRequest = Math.min(...state.requests);
    const resetAt = new Date(oldestRequest + config.windowMs);
    const retryAfter = Math.ceil((resetAt.getTime() - now) / 1000);

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfter,
    };
  }

  // Allow request and record timestamp
  state.requests.push(now);
  rateLimitStore.set(hashedId, state);

  return {
    allowed: true,
    remaining: config.maxRequests - state.requests.length,
    resetAt: new Date(now + config.windowMs),
  };
}

/**
 * Create rate limiter with predefined configuration
 *
 * @example
 * ```typescript
 * // Contact form: 3 requests per hour
 * const contactLimiter = createRateLimiter({
 *   windowMs: 3600000,
 *   maxRequests: 3,
 * });
 *
 * // GitHub API: 10 requests per minute
 * const githubLimiter = createRateLimiter({
 *   windowMs: 60000,
 *   maxRequests: 10,
 * });
 * ```
 */
export function createRateLimiter(config: RateLimitConfig) {
  return {
    checkRateLimit: (identifier: string) => checkRateLimit(identifier, config),
    config,
  };
}

/**
 * Reset rate limit for specific identifier
 *
 * Useful for testing or manual override
 *
 * @param identifier - Identifier to reset
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const hashedId = await hashIdentifier(identifier);
  rateLimitStore.delete(hashedId);
}

/**
 * Clear entire rate limit store
 *
 * Useful for testing
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}

// Predefined rate limiters for common use cases
export const rateLimiters = {
  /** Contact form: 3 requests per hour */
  contact: createRateLimiter({
    windowMs: 3600000,
    maxRequests: 3,
  }),

  /** GitHub API: 10 requests per minute */
  githubApi: createRateLimiter({
    windowMs: 60000,
    maxRequests: 10,
  }),

  /** Analytics ingestion: 60 requests per minute */
  analytics: createRateLimiter({
    windowMs: 60000,
    maxRequests: 60,
  }),
};
