// GET /api/search/skills - Search skills with filters
import { NextRequest, NextResponse } from 'next/server'
import { searchSkills, SkillSearchFilters, SkillSortOption } from '@/lib/search/skills'
import { logSearchQuery } from '@/lib/search/analytics'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Query parameter
  const query = searchParams.get('q') || ''

  // Filter parameters
  const category = searchParams.get('category') || undefined
  const status = searchParams.get('status') || undefined

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Sort
  const sort = (searchParams.get('sort') || 'relevance') as SkillSortOption
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

  // Build filters
  const filters: SkillSearchFilters = {}
  if (category) filters.category = category
  if (status) filters.status = status

  // Perform search
  const startTime = performance.now()
  const response = searchSkills(query, filters, { page, pageSize, sort, sortOrder })
  const searchTimeMs = Math.round(performance.now() - startTime)

  // Log analytics
  logSearchQuery(
    query,
    filters as Record<string, unknown>,
    response.total,
    searchTimeMs,
    'skills'
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
