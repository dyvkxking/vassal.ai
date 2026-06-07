/**
 * Cache monitoring and statistics
 */

import { caches, CacheType } from './core';

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  itemCount: number;
}

interface AllCacheStats {
  agent: CacheStats;
  session: CacheStats;
  node: CacheStats;
  skill: CacheStats;
  proposal: CacheStats;
  governance: CacheStats;
}

/**
 * Get stats for a specific cache
 */
export function getCacheStats(entityType: CacheType): CacheStats {
  const cache = caches[entityType];
  const stats = cache.getStats();
  const total = stats.hits + stats.misses;
  return {
    ...stats,
    hitRate: total > 0 ? stats.hits / total : 0,
  };
}

/**
 * Get stats for all caches
 */
export function getAllCacheStats(): AllCacheStats {
  return {
    agent: getCacheStats('agent'),
    session: getCacheStats('session'),
    node: getCacheStats('node'),
    skill: getCacheStats('skill'),
    proposal: getCacheStats('proposal'),
    governance: getCacheStats('governance'),
  };
}

/**
 * Get memory usage for a cache
 */
export function getCacheSize(entityType: CacheType): number {
  const cache = caches[entityType];
  return cache.getSize();
}

/**
 * Get item count for a cache
 */
export function getCacheItemCount(entityType: CacheType): number {
  const cache = caches[entityType];
  return cache.getItemCount();
}

/**
 * Get all cached keys for a cache type
 */
export function getCacheKeys(entityType: CacheType, prefix?: string): string[] {
  const cache = caches[entityType];
  return cache.keys(prefix);
}

/**
 * Reset stats for a cache
 */
export function resetCacheStats(entityType: CacheType): void {
  const cache = caches[entityType];
  cache.clear();
}

/**
 * Reset all cache stats
 */
export function resetAllCacheStats(): void {
  for (const cache of Object.values(caches)) {
    cache.clear();
  }
}

/**
 * Get cache summary
 */
export function getCacheSummary(): {
  totalItems: number;
  totalSize: number;
  totalHits: number;
  totalMisses: number;
  overallHitRate: number;
} {
  const allStats = getAllCacheStats();
  let totalItems = 0;
  let totalSize = 0;
  let totalHits = 0;
  let totalMisses = 0;

  for (const stats of Object.values(allStats)) {
    totalItems += stats.itemCount;
    totalSize += stats.size;
    totalHits += stats.hits;
    totalMisses += stats.misses;
  }

  const total = totalHits + totalMisses;
  return {
    totalItems,
    totalSize,
    totalHits,
    totalMisses,
    overallHitRate: total > 0 ? totalHits / total : 0,
  };
}