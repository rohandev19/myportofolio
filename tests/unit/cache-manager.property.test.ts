/**
 * Property 7: Cache TTL Invariant
 *
 * Validates: Requirements 4.6
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fc from "fast-check";
import { CacheManager } from "@/lib/cache/cache-manager";

describe("Property 7: Cache TTL Invariant", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return cached data before TTL expires", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }), // TTL in ms
        fc.string(), // cache key
        fc.string(), // cache value
        (ttl, key, value) => {
          const cache = new CacheManager<string>({ ttl });

          // Set value
          cache.set(key, value);

          // Advance time to just before TTL
          vi.advanceTimersByTime(ttl - 100);

          // Should return cached value
          const retrieved = cache.get(key);
          expect(retrieved).toBe(value);
        }
      ),
      { numRuns: 200 }
    );
  });

  it("should return undefined after TTL expires (no stale-while-revalidate)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }),
        fc.string(),
        fc.string(),
        (ttl, key, value) => {
          const cache = new CacheManager<string>({
            ttl,
            staleWhileRevalidate: false,
          });

          cache.set(key, value);

          // Advance time past TTL
          vi.advanceTimersByTime(ttl + 100);

          // Should return undefined (not stale data)
          const retrieved = cache.get(key);
          expect(retrieved).toBeUndefined();
        }
      ),
      { numRuns: 200 }
    );
  });

  it("should return stale data after TTL with stale-while-revalidate", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }),
        fc.string(),
        fc.string(),
        (ttl, key, value) => {
          const cache = new CacheManager<string>({
            ttl,
            staleWhileRevalidate: true,
          });

          cache.set(key, value);

          // Advance time past TTL
          vi.advanceTimersByTime(ttl + 100);

          // Should still return stale data
          const retrieved = cache.get(key);
          expect(retrieved).toBe(value);
        }
      ),
      { numRuns: 200 }
    );
  });

  it("should mark entry as stale after TTL", () => {
    const cache = new CacheManager<string>({ ttl: 5000 });
    const key = "test-key";
    const value = "test-value";

    cache.set(key, value);

    // Before TTL
    vi.advanceTimersByTime(4000);
    expect(cache.isStale(key)).toBe(false);

    // After TTL
    vi.advanceTimersByTime(2000);
    expect(cache.isStale(key)).toBe(true);
  });

  it("should check has() correctly based on TTL", () => {
    const cache = new CacheManager<string>({ ttl: 3000 });
    const key = "test-key";
    const value = "test-value";

    cache.set(key, value);

    // Before TTL
    vi.advanceTimersByTime(2000);
    expect(cache.has(key)).toBe(true);

    // After TTL
    vi.advanceTimersByTime(2000);
    expect(cache.has(key)).toBe(false);
  });

  it("should respect custom TTL per entry", () => {
    const cache = new CacheManager<string>({ ttl: 5000 });

    cache.set("short-key", "short-value", 1000);
    cache.set("long-key", "long-value", 10000);

    // After 2 seconds
    vi.advanceTimersByTime(2000);

    // Short TTL should be stale
    expect(cache.isStale("short-key")).toBe(true);

    // Long TTL should still be fresh
    expect(cache.isStale("long-key")).toBe(false);
  });
});

describe("Cache Basic Operations", () => {
  it("should store and retrieve values", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (key, value) => {
        const cache = new CacheManager<string>({ ttl: 60000 });

        cache.set(key, value);
        const retrieved = cache.get(key);

        expect(retrieved).toBe(value);
      }),
      { numRuns: 200 }
    );
  });

  it("should handle has() correctly", () => {
    const cache = new CacheManager<string>({ ttl: 60000 });

    expect(cache.has("nonexistent")).toBe(false);

    cache.set("exists", "value");
    expect(cache.has("exists")).toBe(true);
  });

  it("should invalidate entries", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (key, value) => {
        const cache = new CacheManager<string>({ ttl: 60000 });

        cache.set(key, value);
        expect(cache.has(key)).toBe(true);

        cache.invalidate(key);
        expect(cache.has(key)).toBe(false);
        expect(cache.get(key)).toBeUndefined();
      }),
      { numRuns: 200 }
    );
  });

  it("should clear all entries", () => {
    const cache = new CacheManager<string>({ ttl: 60000 });

    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    const stats = cache.getStats();
    expect(stats.size).toBe(3);

    cache.clear();

    expect(cache.getStats().size).toBe(0);
    expect(cache.get("key1")).toBeUndefined();
  });
});

describe("LRU Eviction", () => {
  it("should evict least recently used entry when exceeding maxSize", () => {
    const cache = new CacheManager<string>({ ttl: 60000, maxSize: 3 });

    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    // Access key1 to make it recently used
    cache.get("key1");

    // Add 4th entry, should evict key2 (least recently used)
    cache.set("key4", "value4");

    expect(cache.get("key1")).toBe("value1"); // Still there
    expect(cache.get("key2")).toBeUndefined(); // Evicted
    expect(cache.get("key3")).toBe("value3"); // Still there
    expect(cache.get("key4")).toBe("value4"); // Newly added
  });

  it("should maintain maxSize", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 5, max: 20 }),
        (maxSize, numEntries) => {
          const cache = new CacheManager<number>({ ttl: 60000, maxSize });

          // Add entries
          for (let i = 0; i < numEntries; i++) {
            cache.set(`key${i}`, i);
          }

          const stats = cache.getStats();
          expect(stats.size).toBeLessThanOrEqual(maxSize);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("getOrSet Pattern", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should fetch data if not in cache", async () => {
    const cache = new CacheManager<string>({ ttl: 60000 });
    const fetchFn = vi.fn().mockResolvedValue("fetched-value");

    const result = await cache.getOrSet("key", fetchFn);

    expect(result).toBe("fetched-value");
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("should return cached data without calling fetchFn", async () => {
    const cache = new CacheManager<string>({ ttl: 60000 });
    const fetchFn = vi.fn().mockResolvedValue("fetched-value");

    // First call
    await cache.getOrSet("key", fetchFn);

    // Second call should use cache
    const result = await cache.getOrSet("key", fetchFn);

    expect(result).toBe("fetched-value");
    expect(fetchFn).toHaveBeenCalledTimes(1); // Only called once
  });

  it("should refresh stale data in background with stale-while-revalidate", async () => {
    const cache = new CacheManager<string>({
      ttl: 1000,
      staleWhileRevalidate: true,
    });

    const fetchFn = vi.fn().mockResolvedValueOnce("old-value").mockResolvedValueOnce("new-value");

    // Initial fetch
    await cache.getOrSet("key", fetchFn);

    // Advance time past TTL
    vi.advanceTimersByTime(1500);

    // Should return stale value immediately
    const result = await cache.getOrSet("key", fetchFn);
    expect(result).toBe("old-value");

    // Wait for background refresh
    await vi.runAllTimersAsync();

    // Next access should have new value
    const refreshed = cache.get("key");
    expect(refreshed).toBe("new-value");
  });
});

describe("Batch Operations", () => {
  it("should batch get multiple keys", () => {
    const cache = new CacheManager<string>({ ttl: 60000 });

    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    const results = cache.batchGet(["key1", "key2", "nonexistent"]);

    expect(results.size).toBe(2);
    expect(results.get("key1")).toBe("value1");
    expect(results.get("key2")).toBe("value2");
    expect(results.has("nonexistent")).toBe(false);
  });

  it("should batch set multiple entries", () => {
    const cache = new CacheManager<string>({ ttl: 60000 });

    const entries: Array<[string, string]> = [
      ["key1", "value1"],
      ["key2", "value2"],
      ["key3", "value3"],
    ];

    cache.batchSet(entries);

    expect(cache.get("key1")).toBe("value1");
    expect(cache.get("key2")).toBe("value2");
    expect(cache.get("key3")).toBe("value3");
  });
});

describe("getWithMetadata", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return entry with metadata", () => {
    const cache = new CacheManager<string>({ ttl: 5000 });
    const now = Date.now();

    cache.set("key", "value");

    const entry = cache.getWithMetadata("key");

    expect(entry).toBeDefined();
    expect(entry?.data).toBe("value");
    expect(entry?.cachedAt).toBe(now);
    expect(entry?.ttl).toBe(5000);
    expect(entry?.staleAt).toBe(now + 5000);
  });

  it("should return undefined for nonexistent key", () => {
    const cache = new CacheManager<string>({ ttl: 60000 });

    const entry = cache.getWithMetadata("nonexistent");

    expect(entry).toBeUndefined();
  });
});
