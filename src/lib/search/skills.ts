// Skill Search - Full-text search and filtering for skills

import { SearchEngine, tokenize } from './core'
import {
  SkillSearchDocument,
  buildSkillIndex,
} from './index'
import { calculateSkillScore } from './ranking'
import { MOCK_SKILLS } from '@/lib/mock-data'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// Search engine instance
let skillSearchEngine: SearchEngine<SkillSearchDocument> | null = null

// Get or create search engine
function getSkillSearchEngine(): SearchEngine<SkillSearchDocument> {
  if (!skillSearchEngine) {
    skillSearchEngine = new SearchEngine<SkillSearchDocument>()
    const docs = buildSkillIndex(MOCK_SKILLS)
    skillSearchEngine.indexAll(docs)
  }
  return skillSearchEngine
}

// Rebuild index when data changes
export function rebuildSkillIndex(): void {
  skillSearchEngine = null
  getSkillSearchEngine()
}

// Filter options for skill search
export interface SkillSearchFilters {
  category?: string
  status?: string
}

// Sort options
export type SkillSortOption = 'usageCount' | 'rating' | 'createdAt' | 'relevance'

// Facet counts
export interface SkillSearchFacets {
  categories: Record<string, number>
  statusCounts: Record<string, number>
}

// Search response with facets
export interface SkillSearchResponse {
  results: SkillSearchDocument[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  facets: SkillSearchFacets
  searchTimeMs: number
}

/**
 * Search skills with text query and filters
 */
export function searchSkills(
  query: string,
  filters: SkillSearchFilters = {},
  options: {
    page?: number
    pageSize?: number
    sort?: SkillSortOption
    sortOrder?: 'asc' | 'desc'
  } = {}
): SkillSearchResponse {
  const engine = getSkillSearchEngine()

  const {
    page = 1,
    pageSize = PAGE_SIZE_DEFAULT,
    sort = 'relevance',
    sortOrder = 'desc',
  } = options

  // Build filter object for search engine
  const searchFilters: Record<string, string | number | boolean | string[] | undefined> = {}

  if (filters.category) {
    searchFilters.category = filters.category
  }

  // Default to approved only if status not specified
  if (filters.status) {
    searchFilters.status = filters.status
  } else {
    searchFilters.status = 'approved'
  }

  // Determine sort field
  let sortField: string | undefined
  switch (sort) {
    case 'usageCount':
      sortField = 'usageCount'
      break
    case 'rating':
      sortField = 'avgRating'
      break
    case 'createdAt':
      sortField = 'createdAt'
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

  // Calculate facets from all documents
  const allDocs = buildSkillIndex(MOCK_SKILLS)
  const facets = calculateSkillFacets(allDocs, query, filters)

  // Apply custom ranking to results
  const rankedResults = response.results
    .map((result) => ({
      document: result.document,
      score: calculateSkillScore(result.document, query),
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
 * Calculate facet counts for skill search
 */
function calculateSkillFacets(
  docs: SkillSearchDocument[],
  query: string,
  filters: SkillSearchFilters
): SkillSearchFacets {
  // Filter by query first
  let filtered = docs

  if (query.trim()) {
    const queryTokens = tokenize(query)
    filtered = filtered.filter((doc) => {
      const searchText = `${doc.name} ${doc.description}`.toLowerCase()
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

  // Category counts
  const categories: Record<string, number> = {}
  for (const doc of filtered) {
    categories[doc.category] = (categories[doc.category] || 0) + 1
  }

  // Status counts
  const statusCounts: Record<string, number> = {}
  for (const doc of filtered) {
    statusCounts[doc.status] = (statusCounts[doc.status] || 0) + 1
  }

  return {
    categories,
    statusCounts,
  }
}
