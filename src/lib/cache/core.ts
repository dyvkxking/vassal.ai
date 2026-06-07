/**
 * In-memory cache with TTL support and LRU eviction
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
  size: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  itemCount: number;
}

export class Cache {
  private store = new Map<string, CacheEntry<unknown>>();
  private accessOrder: string[] = [];
  private maxSize: number;
  private maxItems: number;
  private stats: CacheStats = { hits: 0, misses: 0, size: 0, itemCount: 0 };

  constructor(maxSize = 100 * 1024 * 1024, maxItems = 10000) {
    this.maxSize = maxSize;
    this.maxItems = maxItems;
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Check expiration
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.delete(key);
      this.stats.misses++;
      return undefined;
    }

    // Update access order for LRU
    this.updateAccessOrder(key);
    entry.lastAccessed = Date.now();
    this.stats.hits++;

    return entry.value;
  }

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttl: number | null = null): void {
    // Check if we need to evict
    const valueSize = this.estimateSize(value);
    const existingEntry = this.store.get(key);
    const currentSize = existingEntry ? existingEntry.size : 0;
    const sizeDiff = valueSize - currentSize;

    if (this.stats.size + sizeDiff > this.maxSize || this.store.size >= this.maxItems) {
      this.evict(sizeDiff);
    }

    const expiresAt = ttl !== null ? Date.now() + ttl : null;

    this.store.set(key, {
      value,
      expiresAt,
      size: valueSize,
      lastAccessed: Date.now(),
    });

    this.updateAccessOrder(key);
    this.stats.size = this.stats.size + sizeDiff;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    const entry = this.store.get(key);
    if (entry) {
      this.stats.size -= entry.size;
      this.store.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      this.stats.itemCount = this.store.size;
      return true;
    }
    return false;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear();
    this.accessOrder = [];
    this.stats = { hits: 0, misses: 0, size: 0, itemCount: 0 };
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get all keys (optionally filtered by prefix)
   */
  keys(prefix?: string): string[] {
    const now = Date.now();
    const allKeys = Array.from(this.store.keys());

    return allKeys.filter(key => {
      if (prefix && !key.startsWith(prefix)) return false;
      const entry = this.store.get(key)!;
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.delete(key);
        return false;
      }
      return true;
    });
  }

  /**
   * Get cache size in bytes
   */
  getSize(): number {
    this.purgeExpired();
    return this.stats.size;
  }

  /**
   * Get item count
   */
  getItemCount(): number {
    this.purgeExpired();
    return this.store.size;
  }

  /**
   * Update access order for LRU tracking
   */
  private updateAccessOrder(key: string): void {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  /**
   * Evict least recently used items until we have enough space
   */
  private evict(requiredSpace: number): void {
    while (
      (this.stats.size + requiredSpace > this.maxSize || this.store.size >= this.maxItems)
      && this.accessOrder.length > 0
    ) {
      const lruKey = this.accessOrder.shift()!;
      const entry = this.store.get(lruKey);
      if (entry) {
        this.stats.size -= entry.size;
        this.store.delete(lruKey);
      }
    }
    this.stats.itemCount = this.store.size;
  }

  /**
   * Estimate size of a value in bytes
   */
  private estimateSize(value: unknown): number {
    try {
      return JSON.stringify(value).length * 2; // UTF-16
    } catch {
      return 100; // Default estimate
    }
  }

  /**
   * Remove expired entries
   */
  private purgeExpired(): void {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    for (const [key, entry] of entries) {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.stats.size -= entry.size;
        this.store.delete(key);
        this.accessOrder = this.accessOrder.filter(k => k !== key);
      }
    }
    this.stats.itemCount = this.store.size;
  }
}

// Global cache instances
const agentCache = new Cache(100 * 1024 * 1024, 10000);
const sessionCache = new Cache(200 * 1024 * 1024, 10000);
const nodeCache = new Cache(50 * 1024 * 1024, 5000);
const skillCache = new Cache(50 * 1024 * 1024, 5000);
const proposalCache = new Cache(50 * 1024 * 1024, 5000);
const governanceCache = new Cache(20 * 1024 * 1024, 1000);

export const caches = {
  agent: agentCache,
  session: sessionCache,
  node: nodeCache,
  skill: skillCache,
  proposal: proposalCache,
  governance: governanceCache,
};

export type CacheType = keyof typeof caches;