// Search Analytics - Query logging and performance monitoring

interface SearchQueryLog {
  query: string
  filters: Record<string, unknown>
  resultCount: number
  timestamp: number
  searchTimeMs: number
  type: 'agents' | 'skills' | 'proposals' | 'autocomplete'
}

interface SearchStats {
  totalQueries: number
  totalSearches: number
  totalAutocompletes: number
  p95LatencyMs: number
  p99LatencyMs: number
  avgLatencyMs: number
  cacheHitRate: number
  zeroResultQueries: number
}

// In-memory storage for search analytics
const queryLog: SearchQueryLog[] = []
const MAX_LOG_SIZE = 10000

// Performance tracking
let totalSearchTimeMs = 0
let totalAutocompleteTimeMs = 0
let searchCount = 0
let autocompleteCount = 0
let cacheHits = 0
let cacheMisses = 0

/**
 * Log a search query
 */
export function logSearchQuery(
  query: string,
  filters: Record<string, unknown>,
  resultCount: number,
  searchTimeMs: number,
  type: 'agents' | 'skills' | 'proposals' | 'autocomplete'
): void {
  const entry: SearchQueryLog = {
    query,
    filters,
    resultCount,
    timestamp: Date.now(),
    searchTimeMs,
    type,
  }

  queryLog.push(entry)

  // Trim log if too large
  if (queryLog.length > MAX_LOG_SIZE) {
    queryLog.shift()
  }

  // Update performance counters
  if (type === 'autocomplete') {
    totalAutocompleteTimeMs += searchTimeMs
    autocompleteCount++
  } else {
    totalSearchTimeMs += searchTimeMs
    searchCount++
  }
}

/**
 * Get popular searches
 */
export function getPopularSearches(limit: number = 10): Array<{ query: string; count: number }> {
  const queryCounts = new Map<string, number>()

  for (const entry of queryLog) {
    const normalizedQuery = entry.query.toLowerCase().trim()
    if (normalizedQuery) {
      queryCounts.set(normalizedQuery, (queryCounts.get(normalizedQuery) || 0) + 1)
    }
  }

  const sorted = Array.from(queryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)

  return sorted.map(([query, count]) => ({ query, count }))
}

/**
 * Get queries that returned zero results
 */
export function getZeroResultQueries(): Array<{ query: string; timestamp: number }> {
  return queryLog
    .filter((entry) => entry.resultCount === 0 && entry.query.trim().length > 0)
    .map((entry) => ({
      query: entry.query,
      timestamp: entry.timestamp,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)
}

/**
 * Get search statistics
 */
export function getSearchStats(): SearchStats {
  const allSearchTimes = queryLog
    .filter((e) => e.type !== 'autocomplete')
    .map((e) => e.searchTimeMs)
    .sort((a, b) => a - b)

  const allAutocompleteTimes = queryLog
    .filter((e) => e.type === 'autocomplete')
    .map((e) => e.searchTimeMs)
    .sort((a, b) => a - b)

  // Calculate percentiles
  const p95Index = Math.floor(allSearchTimes.length * 0.95)
  const p99Index = Math.floor(allSearchTimes.length * 0.99)

  const p95LatencyMs = allSearchTimes[p95Index] || 0
  const p99LatencyMs = allSearchTimes[p99Index] || 0

  const avgLatencyMs =
    searchCount > 0 ? Math.round(totalSearchTimeMs / searchCount) : 0

  const totalCacheOps = cacheHits + cacheMisses
  const cacheHitRate = totalCacheOps > 0 ? cacheHits / totalCacheOps : 0

  const zeroResultQueries = queryLog.filter(
    (e) => e.resultCount === 0 && e.query.trim().length > 0
  ).length

  return {
    totalQueries: queryLog.length,
    totalSearches: searchCount,
    totalAutocompletes: autocompleteCount,
    p95LatencyMs,
    p99LatencyMs,
    avgLatencyMs,
    cacheHitRate: Math.round(cacheHitRate * 100) / 100,
    zeroResultQueries,
  }
}

/**
 * Record a cache hit
 */
export function recordCacheHit(): void {
  cacheHits++
}

/**
 * Record a cache miss
 */
export function recordCacheMiss(): void {
  cacheMisses++
}

/**
 * Clear all analytics data
 */
export function clearSearchAnalytics(): void {
  queryLog.length = 0
  totalSearchTimeMs = 0
  totalAutocompleteTimeMs = 0
  searchCount = 0
  autocompleteCount = 0
  cacheHits = 0
  cacheMisses = 0
}

/**
 * Get recent queries
 */
export function getRecentQueries(
  limit: number = 20,
  type?: 'agents' | 'skills' | 'proposals' | 'autocomplete'
): SearchQueryLog[] {
  let filtered = queryLog

  if (type) {
    filtered = filtered.filter((e) => e.type === type)
  }

  return filtered
    .slice(-limit)
    .reverse()
}
