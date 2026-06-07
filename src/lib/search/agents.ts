// Agent Search - Full-text search and filtering for agents

import { SearchEngine, tokenize } from './core'
import {
  AgentSearchDocument,
  buildAgentIndex,
} from './index'
import { calculateAgentScore } from './ranking'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// Search engine instance
let agentSearchEngine: SearchEngine<AgentSearchDocument> | null = null

// Get or create search engine
function getAgentSearchEngine(): SearchEngine<AgentSearchDocument> {
  if (!agentSearchEngine) {
    agentSearchEngine = new SearchEngine<AgentSearchDocument>()
    const docs = buildAgentIndex(MOCK_AGENTS)
    agentSearchEngine.indexAll(docs)
  }
  return agentSearchEngine
}

// Rebuild index when data changes
export function rebuildAgentIndex(): void {
  agentSearchEngine = null
  getAgentSearchEngine()
}

// Filter options for agent search
export interface AgentSearchFilters {
  category?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
}

// Sort options
export type AgentSortOption = 'relevance' | 'rating' | 'price' | 'createdAt' | 'sessions'

// Facet counts
export interface AgentSearchFacets {
  categories: Record<string, number>
  priceRange: { min: number; max: number }
  ratingDistribution: Record<string, number>
}

// Search response with facets
export interface AgentSearchResponse {
  results: AgentSearchDocument[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  facets: AgentSearchFacets
  searchTimeMs: number
}

/**
 * Search agents with text query and filters
 */
export function searchAgents(
  query: string,
  filters: AgentSearchFilters = {},
  options: {
    page?: number
    pageSize?: number
    sort?: AgentSortOption
    sortOrder?: 'asc' | 'desc'
  } = {}
): AgentSearchResponse {
  const engine = getAgentSearchEngine()

  const {
    page = 1,
    pageSize = PAGE_SIZE_DEFAULT,
    sort = 'relevance',
    sortOrder = 'desc',
  } = options

  // Build filter object for search engine
  const searchFilters: Record<string, string | number | boolean | string[] | undefined | { min?: number; max?: number }> = {}

  if (filters.category) {
    searchFilters.category = filters.category
  }

  if (filters.status) {
    searchFilters.status = filters.status
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    searchFilters.priceMin = {
      min: filters.minPrice,
      max: filters.maxPrice,
    } as { min?: number; max?: number }
  }

  if (filters.minRating !== undefined) {
    searchFilters.avgRating = { min: filters.minRating } as { min?: number }
  }

  // Determine sort field
  let sortField: string | undefined
  switch (sort) {
    case 'rating':
      sortField = 'avgRating'
      break
    case 'price':
      sortField = 'priceMin'
      break
    case 'createdAt':
      sortField = 'createdAt'
      break
    case 'sessions':
      sortField = 'totalSessions'
      break
    default:
      sortField = undefined // Use relevance score
  }

  // Perform search
  const response = engine.search(query, {
    page,
    pageSize: Math.min(pageSize, PAGE_SIZE_MAX),
    sort: sortField,
    sortOrder,
    filters: searchFilters,
  })

  // Calculate facets from all documents (not just results)
  const allDocs = buildAgentIndex(MOCK_AGENTS)
  const facets = calculateAgentFacets(allDocs, query, filters)

  // Apply custom ranking to results
  const rankedResults = response.results
    .map((result) => ({
      document: result.document,
      score: calculateAgentScore(result.document, query),
    }))
    .sort((a, b) => b.score - a.score)

  return {
    results: rankedResults.map((r) => r.document),
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    facets,
    searchTimeMs: response.searchTimeMs,
  }
}

/**
 * Calculate facet counts for agent search
 */
function calculateAgentFacets(
  docs: AgentSearchDocument[],
  query: string,
  filters: AgentSearchFilters
): AgentSearchFacets {
  // Filter by query first
  let filtered = docs

  if (query.trim()) {
    const queryTokens = tokenize(query)
    filtered = filtered.filter((doc) => {
      const searchText = `${doc.name} ${doc.description} ${doc.capabilities}`.toLowerCase()
      return queryTokens.some((token) => searchText.includes(token))
    })
  }

  // Apply existing filters for accurate counts
  if (filters.category) {
    filtered = filtered.filter((d) => d.category === filters.category)
  }
  if (filters.status) {
    filtered = filtered.filter((d) => d.status === filters.status)
  }
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((d) => d.priceMin >= filters.minPrice!)
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((d) => d.priceMin <= filters.maxPrice!)
  }
  if (filters.minRating !== undefined) {
    filtered = filtered.filter((d) => d.avgRating >= filters.minRating!)
  }

  // Category counts
  const categories: Record<string, number> = {}
  for (const doc of filtered) {
    categories[doc.category] = (categories[doc.category] || 0) + 1
  }

  // Price range
  let minPrice = Infinity
  let maxPrice = -Infinity
  for (const doc of filtered) {
    if (doc.priceMin < minPrice) minPrice = doc.priceMin
    if (doc.priceMin > maxPrice) maxPrice = doc.priceMin
  }
  if (minPrice === Infinity) minPrice = 0
  if (maxPrice === -Infinity) maxPrice = 0

  // Rating distribution
  const ratingDistribution: Record<string, number> = {
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
  }
  for (const doc of filtered) {
    const bucket = Math.round(doc.avgRating).toString() as keyof typeof ratingDistribution
    if (bucket in ratingDistribution) {
      ratingDistribution[bucket]++
    }
  }

  return {
    categories,
    priceRange: { min: minPrice, max: maxPrice },
    ratingDistribution,
  }
}
