// Autocomplete - Fast prefix matching for agent and skill names

import { MOCK_AGENTS } from '@/lib/mock-data'
import { MOCK_SKILLS } from '@/lib/mock-data'

// Cache for autocomplete results
interface AutocompleteCache {
  agentCache: Map<string, { results: string[]; timestamp: number }>
  skillCache: Map<string, { results: string[]; timestamp: number }>
}

const CACHE_TTL_MS = 30000 // 30 seconds
const MAX_AUTOCOMPLETE_RESULTS = 10

const cache: AutocompleteCache = {
  agentCache: new Map(),
  skillCache: new Map(),
}

/**
 * Autocomplete agent names by prefix
 * Response time target < 100ms with caching
 */
export function autocompleteAgents(prefix: string): string[] {
  if (!prefix || prefix.length < 1) {
    return []
  }

  const normalizedPrefix = prefix.toLowerCase().trim()

  // Check cache
  const cached = cache.agentCache.get(normalizedPrefix)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.results
  }

  // Perform prefix matching
  const results: string[] = []
  const seen = new Set<string>()

  for (const agent of MOCK_AGENTS) {
    if (agent.status !== 'active') continue

    const nameLower = agent.name.toLowerCase()
    if (nameLower.startsWith(normalizedPrefix) && !seen.has(agent.name)) {
      results.push(agent.name)
      seen.add(agent.name)
    }
  }

  // Also check for contains match for better UX
  if (results.length < MAX_AUTOCOMPLETE_RESULTS) {
    for (const agent of MOCK_AGENTS) {
      if (agent.status !== 'active') continue
      if (results.length >= MAX_AUTOCOMPLETE_RESULTS) break

      const nameLower = agent.name.toLowerCase()
      if (
        nameLower.includes(normalizedPrefix) &&
        !nameLower.startsWith(normalizedPrefix) &&
        !seen.has(agent.name)
      ) {
        results.push(agent.name)
        seen.add(agent.name)
      }
    }
  }

  // Limit results
  const limitedResults = results.slice(0, MAX_AUTOCOMPLETE_RESULTS)

  // Update cache
  cache.agentCache.set(normalizedPrefix, {
    results: limitedResults,
    timestamp: Date.now(),
  })

  return limitedResults
}

/**
 * Autocomplete skill names by prefix
 * Response time target < 100ms with caching
 */
export function autocompleteSkills(prefix: string): string[] {
  if (!prefix || prefix.length < 1) {
    return []
  }

  const normalizedPrefix = prefix.toLowerCase().trim()

  // Check cache
  const cached = cache.skillCache.get(normalizedPrefix)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.results
  }

  // Perform prefix matching
  const results: string[] = []
  const seen = new Set<string>()

  for (const skill of MOCK_SKILLS) {
    if (skill.status !== 'approved') continue

    const nameLower = skill.name.toLowerCase()
    if (nameLower.startsWith(normalizedPrefix) && !seen.has(skill.name)) {
      results.push(skill.name)
      seen.add(skill.name)
    }
  }

  // Also check for contains match for better UX
  if (results.length < MAX_AUTOCOMPLETE_RESULTS) {
    for (const skill of MOCK_SKILLS) {
      if (skill.status !== 'approved') continue
      if (results.length >= MAX_AUTOCOMPLETE_RESULTS) break

      const nameLower = skill.name.toLowerCase()
      if (
        nameLower.includes(normalizedPrefix) &&
        !nameLower.startsWith(normalizedPrefix) &&
        !seen.has(skill.name)
      ) {
        results.push(skill.name)
        seen.add(skill.name)
      }
    }
  }

  // Limit results
  const limitedResults = results.slice(0, MAX_AUTOCOMPLETE_RESULTS)

  // Update cache
  cache.skillCache.set(normalizedPrefix, {
    results: limitedResults,
    timestamp: Date.now(),
  })

  return limitedResults
}

/**
 * Clear autocomplete cache
 */
export function clearAutocompleteCache(): void {
  cache.agentCache.clear()
  cache.skillCache.clear()
}

/**
 * Get cache statistics
 */
export function getAutocompleteCacheStats(): {
  agentCacheSize: number
  skillCacheSize: number
} {
  return {
    agentCacheSize: cache.agentCache.size,
    skillCacheSize: cache.skillCache.size,
  }
}
