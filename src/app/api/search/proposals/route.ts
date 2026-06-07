// GET /api/search/proposals - Search governance proposals with filters
import { NextRequest, NextResponse } from 'next/server'
import {
  searchProposals,
  ProposalSearchFilters,
  ProposalSortOption,
} from '@/lib/search/proposals'
import { logSearchQuery } from '@/lib/search/analytics'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Query parameter
  const query = searchParams.get('q') || ''

  // Filter parameters
  const status = searchParams.get('status') || undefined
  const category = searchParams.get('category') || undefined
  const author = searchParams.get('author') || undefined
  const quorumMet = searchParams.get('quorumMet')
    ? searchParams.get('quorumMet') === 'true'
    : undefined

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Sort
  const sort = (searchParams.get('sort') || 'relevance') as ProposalSortOption
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

  // Build filters
  const filters: ProposalSearchFilters = {}
  if (status) filters.status = status
  if (category) filters.category = category
  if (author) filters.author = author
  if (quorumMet !== undefined) filters.quorumMet = quorumMet

  // Perform search
  const startTime = performance.now()
  const response = searchProposals(query, filters, { page, pageSize, sort, sortOrder })
  const searchTimeMs = Math.round(performance.now() - startTime)

  // Log analytics
  logSearchQuery(
    query,
    filters as Record<string, unknown>,
    response.total,
    searchTimeMs,
    'proposals'
  )

  return NextResponse.json(
    {
      results: response.results,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
      facets: response.facets,
      searchTimeMs: response.searchTimeMs,
    },
    {
      status: 200,
      headers: {
        'X-Search-Time-Ms': String(response.searchTimeMs),
        'X-Total-Count': String(response.total),
      },
    }
  )
}
