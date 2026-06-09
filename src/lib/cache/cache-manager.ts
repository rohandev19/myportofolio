/**
 * Cache Manager
 *
 * Generic in-memory cache with TTL, LRU eviction, and stale-while-revalidate support.
 * Optimized for Edge Runtime - no external dependencies.
 */

import type { CacheEntry } from "@/types/portfolio.types";

export interface CacheOptions {
  /** Time-to-live in milliseconds */
  ttl: number;
  /** Maximum number of entries (LRU eviction) */
  maxSize?: number;
  /** Enable stale-while-revalidate (return stale data while fetching fresh) */
  staleWhileRevalidate?: boolean;
}

export class CacheManager<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>(); // For LRU tracking
  private accessCounter = 0;
  private readonly maxSize: number;
  private readonly defaultTtl: number;
  private readonly staleWhileRevalidate: boolean;

  constructor(options: CacheOptions) {
    this.defaultTtl = options.ttl;
    this.maxSize = options.maxSize ?? 100;
    this.staleWhileRevalidate = options.staleWhileRevalidate ?? true;
  }

  /**
   * Get value from cache
   *
   * @param key - Cache key
   * @returns Cached value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Update access order for LRU
    this.accessCounter++;
    this.accessOrder.set(key, this.accessCounter);

    // Check if expired
    const now = Date.now();
    if (now > entry.staleAt) {
      if (this.staleWhileRevalidate) {
        // Return stale data (caller should trigger background refresh)
        return entry.data;
      } else {
        // Remove expired entry
        this.cache.delete(key);
        this.accessOrder.delete(key);
        return undefined;
      }
    }

    return entry.data;
  }

  /**
   * Set value in cache
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Optional custom TTL (overrides default)
   */
  set(key: string, value: T, ttl?: number): void {
    const effectiveTtl = ttl ?? this.defaultTtl;
    const now = Date.now();

    const entry: CacheEntry<T> = {
      data: value,
      cachedAt: now,
      ttl: effectiveTtl,
      staleAt: now + effectiveTtl,
    };

    this.cache.set(key, entry);

    // Update access order
    this.accessCounter++;
    this.accessOrder.set(key, this.accessCounter);

    // Evict LRU entry if over max size
    if (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
  }

  /**
   * Check if key exists and is not stale
   *
   * @param key - Cache key
   * @returns True if key exists and is fresh
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    return now <= entry.staleAt;
  }

  /**
   * Check if cached data is stale
   *
   * @param key - Cache key
   * @returns True if data exists but is stale
   */
  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    return now > entry.staleAt;
  }

  /**
   * Get cached value with metadata
   *
   * Useful for determining if background refresh is needed
   *
   * @param key - Cache key
   * @returns Cache entry with metadata or undefined
   */
  getWithMetadata(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key);

    if (entry) {
      // Update access order for LRU
      this.accessCounter++;
      this.accessOrder.set(key, this.accessCounter);
    }

    return entry;
  }

  /**
   * Invalidate (delete) cache entry
   *
   * @param key - Cache key to invalidate
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    this.accessOrder.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;
  }

  /**
   * Get cache statistics
   *
   * @returns Cache stats object
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate?: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }

  /**
   * Evict least recently used entry
   *
   * Called automatically when cache exceeds maxSize
   */
  private evictLRU(): void {
    let oldestKey: string | undefined;
    let oldestAccess = Infinity;

    // Find least recently accessed entry
    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }

  /**
   * Get or set pattern (cache-aside)
   *
   * Fetches from cache if available, otherwise calls fetchFn and caches result
   *
   * @example
   * ```typescript
   * const cache = new CacheManager<User>({ ttl: 300000 });
   *
   * const user = await cache.getOrSet('user:123', async () => {
   *   return await fetchUserFromDB('123');
   * });
   * ```
   *
   * @param key - Cache key
   * @param fetchFn - Function to fetch data if not in cache
   * @param ttl - Optional custom TTL
   * @returns Cached or freshly fetched data
   */
  async getOrSet(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<T> {
    // Try to get from cache
    const cached = this.get(key);
    if (cached !== undefined && !this.isStale(key)) {
      return cached;
    }

    // If stale and stale-while-revalidate enabled, return stale and refresh in background
    if (cached !== undefined && this.staleWhileRevalidate && this.isStale(key)) {
      // Background refresh (fire and forget)
      fetchFn()
        .then((freshData) => {
          this.set(key, freshData, ttl);
        })
        .catch((error) => {
          console.error(`Background refresh failed for key: ${key}`, error);
        });

      return cached;
    }

    // Fetch fresh data
    const freshData = await fetchFn();
    this.set(key, freshData, ttl);
    return freshData;
  }

  /**
   * Batch get multiple keys
   *
   * @param keys - Array of cache keys
   * @returns Map of key to value (only includes found keys)
   */
  batchGet(keys: string[]): Map<string, T> {
    const results = new Map<string, T>();

    for (const key of keys) {
      const value = this.get(key);
      if (value !== undefined) {
        results.set(key, value);
      }
    }

    return results;
  }

  /**
   * Batch set multiple entries
   *
   * @param entries - Array of [key, value] tuples
   * @param ttl - Optional custom TTL for all entries
   */
  batchSet(entries: Array<[string, T]>, ttl?: number): void {
    for (const [key, value] of entries) {
      this.set(key, value, ttl);
    }
  }
}

/**
 * Create predefined cache instances for common use cases
 */
export const cacheInstances = {
  /** GitHub API cache (5 min TTL) */
  github: new CacheManager<unknown>({
    ttl: 5 * 60 * 1000,
    maxSize: 50,
    staleWhileRevalidate: true,
  }),

  /** Analytics cache (1 min TTL) */
  analytics: new CacheManager<unknown>({
    ttl: 60 * 1000,
    maxSize: 100,
    staleWhileRevalidate: false,
  }),

  /** Blog content cache (1 hour TTL) */
  blog: new CacheManager<unknown>({
    ttl: 60 * 60 * 1000,
    maxSize: 200,
    staleWhileRevalidate: true,
  }),
};
