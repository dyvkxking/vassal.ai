// GET /api/search/agents - Search agents with filters
import { NextRequest, NextResponse } from 'next/server'
import { searchAgents, AgentSearchFilters, AgentSortOption } from '@/lib/search/agents'
import { logSearchQuery } from '@/lib/search/analytics'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Query parameter
  const query = searchParams.get('q') || ''

  // Filter parameters
  const category = searchParams.get('category') || undefined
  const status = searchParams.get('status') || undefined
  const minPrice = searchParams.get('minPrice')
    ? parseFloat(searchParams.get('minPrice')!)
    : undefined
  const maxPrice = searchParams.get('maxPrice')
    ? parseFloat(searchParams.get('maxPrice')!)
    : undefined
  const minRating = searchParams.get('minRating')
    ? parseFloat(searchParams.get('minRating')!)
    : undefined

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Sort
  const sort = (searchParams.get('sort') || 'relevance') as AgentSortOption
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

  // Build filters
  const filters: AgentSearchFilters = {}
  if (category) filters.category = category
  if (status) filters.status = status
  if (minPrice !== undefined) filters.minPrice = minPrice
  if (maxPrice !== undefined) filters.maxPrice = maxPrice
  if (minRating !== undefined) filters.minRating = minRating

  // Perform search
  const startTime = performance.now()
  const response = searchAgents(query, filters, { page, pageSize, sort, sortOrder })
  const searchTimeMs = Math.round(performance.now() - startTime)

  // Log analytics
  logSearchQuery(
    query,
    filters as Record<string, unknown>,
    response.total,
    searchTimeMs,
    'agents'
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
