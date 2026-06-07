// Proposal Search - Full-text search and filtering for governance proposals

import { SearchEngine, tokenize } from './core'
import {
  ProposalSearchDocument,
  buildProposalIndex,
} from './index'
import { calculateProposalScore } from './ranking'
import { MOCK_PROPOSALS } from '@/lib/mock-data'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// Search engine instance
let proposalSearchEngine: SearchEngine<ProposalSearchDocument> | null = null

// Get or create search engine
function getProposalSearchEngine(): SearchEngine<ProposalSearchDocument> {
  if (!proposalSearchEngine) {
    proposalSearchEngine = new SearchEngine<ProposalSearchDocument>()
    const docs = buildProposalIndex(MOCK_PROPOSALS)
    proposalSearchEngine.indexAll(docs)
  }
  return proposalSearchEngine
}

// Rebuild index when data changes
export function rebuildProposalIndex(): void {
  proposalSearchEngine = null
  getProposalSearchEngine()
}

// Filter options for proposal search
export interface ProposalSearchFilters {
  status?: string
  category?: string
  author?: string
  quorumMet?: boolean
}

// Sort options
export type ProposalSortOption = 'endTime' | 'votesFor' | 'createdAt' | 'relevance'

// Facet counts
export interface ProposalSearchFacets {
  categories: Record<string, number>
  statusCounts: Record<string, number>
  quorumCounts: { met: number; notMet: number }
}

// Search response with facets
export interface ProposalSearchResponse {
  results: ProposalSearchDocument[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  facets: ProposalSearchFacets
  searchTimeMs: number
}

/**
 * Search proposals with text query and filters
 */
export function searchProposals(
  query: string,
  filters: ProposalSearchFilters = {},
  options: {
    page?: number
    pageSize?: number
    sort?: ProposalSortOption
    sortOrder?: 'asc' | 'desc'
  } = {}
): ProposalSearchResponse {
  const engine = getProposalSearchEngine()

  const {
    page = 1,
    pageSize = PAGE_SIZE_DEFAULT,
    sort = 'relevance',
    sortOrder = 'desc',
  } = options

  // Build filter object for search engine
  const searchFilters: Record<string, string | number | boolean | string[] | undefined> = {}

  if (filters.status) {
    searchFilters.status = filters.status
  }

  if (filters.category) {
    searchFilters.category = filters.category
  }

  if (filters.author) {
    searchFilters.author = filters.author
  }

  if (filters.quorumMet !== undefined) {
    searchFilters.quorumMet = filters.quorumMet
  }

  // Determine sort field
  let sortField: string | undefined
  switch (sort) {
    case 'endTime':
      sortField = 'endTime'
      break
    case 'votesFor':
      sortField = 'votesFor'
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
  const allDocs = buildProposalIndex(MOCK_PROPOSALS)
  const facets = calculateProposalFacets(allDocs, query, filters)

  // Apply custom ranking to results
  const rankedResults = response.results
    .map((result) => ({
      document: result.document,
      score: calculateProposalScore(result.document, query),
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
 * Calculate facet counts for proposal search
 */
function calculateProposalFacets(
  docs: ProposalSearchDocument[],
  query: string,
  filters: ProposalSearchFilters
): ProposalSearchFacets {
  // Filter by query first
  let filtered = docs

  if (query.trim()) {
    const queryTokens = tokenize(query)
    filtered = filtered.filter((doc) => {
      const searchText = `${doc.title} ${doc.description}`.toLowerCase()
      return queryTokens.some((token) => searchText.includes(token))
    })
  }

  // Apply existing filters for accurate counts
  if (filters.status) {
    filtered = filtered.filter((d) => d.status === filters.status)
  }
  if (filters.category) {
    filtered = filtered.filter((d) => d.category === filters.category)
  }
  if (filters.author) {
    filtered = filtered.filter((d) => d.author === filters.author)
  }
  if (filters.quorumMet !== undefined) {
    filtered = filtered.filter((d) => d.quorumMet === filters.quorumMet)
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

  // Quorum counts
  let quorumMet = 0
  let quorumNotMet = 0
  for (const doc of filtered) {
    if (doc.quorumMet) {
      quorumMet++
    } else {
      quorumNotMet++
    }
  }

  return {
    categories,
    statusCounts,
    quorumCounts: { met: quorumMet, notMet: quorumNotMet },
  }
}
