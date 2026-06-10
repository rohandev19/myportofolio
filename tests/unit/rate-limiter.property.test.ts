/**
 * Property 8: Rate Limiter Window Correctness
 *
 * Validates: Requirements 4.10, 11.11
 */

import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import {
  checkRateLimit,
  createRateLimiter,
  clearRateLimitStore,
} from "@/lib/rate-limit/sliding-window";

describe("Property 8: Rate Limiter Window Correctness", () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  it("should allow exactly N requests when N <= maxRequests", async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 10 }), async (numRequests) => {
        // Use unique identifier per test run
        const identifier = `test-user-${Date.now()}-${Math.random()}`;
        const config = {
          windowMs: 60000,
          maxRequests: 10,
        };

        let allowedCount = 0;

        // Make N requests
        for (let i = 0; i < numRequests; i++) {
          const result = await checkRateLimit(identifier, config);
          if (result.allowed) {
            allowedCount++;
          }
        }

        // All requests should be allowed when N <= 10
        expect(allowedCount).toBe(numRequests);
      }),
      { numRuns: 50 }
    );
  });

  it("should allow exactly maxRequests when N > maxRequests", async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 11, max: 50 }), async (numRequests) => {
        // Use unique identifier per test run
        const identifier = `test-user-${Date.now()}-${Math.random()}`;
        const config = {
          windowMs: 60000,
          maxRequests: 10,
        };

        let allowedCount = 0;

        // Make N requests
        for (let i = 0; i < numRequests; i++) {
          const result = await checkRateLimit(identifier, config);
          if (result.allowed) {
            allowedCount++;
          }
        }

        // Exactly 10 requests should be allowed
        expect(allowedCount).toBe(10);
      }),
      { numRuns: 300 }
    );
  });

  it("should reject requests after limit is reached", async () => {
    const config = {
      windowMs: 60000,
      maxRequests: 5,
    };

    const identifier = "test-user";

    // Make 5 requests (should all be allowed)
    for (let i = 0; i < 5; i++) {
      const result = await checkRateLimit(identifier, config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4 - i);
    }

    // 6th request should be rejected
    const sixthResult = await checkRateLimit(identifier, config);
    expect(sixthResult.allowed).toBe(false);
    expect(sixthResult.remaining).toBe(0);
    expect(sixthResult.retryAfter).toBeGreaterThan(0);
  });

  it("should provide accurate remaining count", async () => {
    const config = {
      windowMs: 60000,
      maxRequests: 10,
    };

    const identifier = "test-user-remaining";

    for (let i = 0; i < 10; i++) {
      const result = await checkRateLimit(identifier, config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9 - i);
    }
  });

  it("should isolate rate limits per identifier", async () => {
    const config = {
      windowMs: 60000,
      maxRequests: 3,
    };

    // User 1 makes 3 requests
    for (let i = 0; i < 3; i++) {
      const result = await checkRateLimit("user-1", config);
      expect(result.allowed).toBe(true);
    }

    // User 1's 4th request should be blocked
    const user1Blocked = await checkRateLimit("user-1", config);
    expect(user1Blocked.allowed).toBe(false);

    // User 2 should still have fresh quota
    const user2First = await checkRateLimit("user-2", config);
    expect(user2First.allowed).toBe(true);
    expect(user2First.remaining).toBe(2);
  });

  it("should handle concurrent requests correctly", async () => {
    const config = {
      windowMs: 60000,
      maxRequests: 10,
    };

    const identifier = "concurrent-user";

    // Make 15 concurrent requests
    const promises = Array.from({ length: 15 }, () => checkRateLimit(identifier, config));

    const results = await Promise.all(promises);

    // Count allowed and rejected
    const allowed = results.filter((r) => r.allowed).length;
    const rejected = results.filter((r) => !r.allowed).length;

    // Exactly 10 should be allowed, 5 rejected
    expect(allowed).toBe(10);
    expect(rejected).toBe(5);
  });

  it("should provide resetAt timestamp in the future", async () => {
    const config = {
      windowMs: 60000,
      maxRequests: 5,
    };

    const identifier = "test-reset";
    const now = Date.now();

    const result = await checkRateLimit(identifier, config);

    expect(result.resetAt.getTime()).toBeGreaterThan(now);
    expect(result.resetAt.getTime()).toBeLessThanOrEqual(now + config.windowMs);
  });

  it("should provide retryAfter in seconds when rate limited", async () => {
    const config = {
      windowMs: 60000,
      maxRequests: 2,
    };

    const identifier = "test-retry";

    // Exhaust the limit
    await checkRateLimit(identifier, config);
    await checkRateLimit(identifier, config);

    // Next request should be rate limited
    const result = await checkRateLimit(identifier, config);

    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeDefined();
    expect(result.retryAfter).toBeGreaterThan(0);
    expect(result.retryAfter).toBeLessThanOrEqual(60); // Max 60 seconds
  });
});

describe("createRateLimiter", () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  it("should create limiter with custom config", async () => {
    const limiter = createRateLimiter({
      windowMs: 5000,
      maxRequests: 3,
    });

    const identifier = "custom-user";

    // Should allow 3 requests
    for (let i = 0; i < 3; i++) {
      const result = await limiter.checkRateLimit(identifier);
      expect(result.allowed).toBe(true);
    }

    // 4th should be blocked
    const blocked = await limiter.checkRateLimit(identifier);
    expect(blocked.allowed).toBe(false);
  });

  it("should expose config", () => {
    const config = {
      windowMs: 10000,
      maxRequests: 5,
    };

    const limiter = createRateLimiter(config);

    expect(limiter.config).toEqual(config);
  });
});

describe("Sliding Window Behavior", () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  it("should use sliding window (not fixed window)", async () => {
    const config = {
      windowMs: 1000, // 1 second window
      maxRequests: 2,
    };

    const identifier = "sliding-test";

    // Make 2 requests at T=0
    await checkRateLimit(identifier, config);
    await checkRateLimit(identifier, config);

    // 3rd request at T=0 should be blocked
    const blocked = await checkRateLimit(identifier, config);
    expect(blocked.allowed).toBe(false);

    // Wait 600ms (still within window of first request)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should still be blocked (first request still in window)
    const stillBlocked = await checkRateLimit(identifier, config);
    expect(stillBlocked.allowed).toBe(false);

    // Wait another 500ms (1.1s total, first request expired)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Now should be allowed (first request is outside window)
    const nowAllowed = await checkRateLimit(identifier, config);
    expect(nowAllowed.allowed).toBe(true);
  });
});
