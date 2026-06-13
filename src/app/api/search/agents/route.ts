// GET /api/search/agents - Search agents with filters
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transformAgent } from '@/lib/db/transformers'
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
  const sort = searchParams.get('sort') || 'relevance'
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

  // Build Prisma where clause
  const where: Record<string, unknown> = {}

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = category
  }

  if (status) {
    where.status = status
  }

  if (minRating) {
    where.avgRating = { gte: minRating }
  }

  // Price filters (check all price fields)
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, unknown> = {}
    if (minPrice !== undefined) {
      priceFilter.gte = minPrice
    }
    if (maxPrice !== undefined) {
      priceFilter.lte = maxPrice
    }
    where.OR = [
      { pricePerMinute: priceFilter },
      { pricePerSecond: priceFilter },
      { pricePerCall: priceFilter },
      { flatPrice: priceFilter },
    ]
  }

  // Determine sort order
  let orderBy: Record<string, string> = { qualityScore: 'desc' }
  switch (sort) {
    case 'rating':
      orderBy = { avgRating: sortOrder }
      break
    case 'price':
      orderBy = { pricePerMinute: sortOrder }
      break
    case 'createdAt':
      orderBy = { createdAt: sortOrder }
      break
    case 'sessions':
      orderBy = { totalSessions: sortOrder }
      break
  }

  try {
    const startTime = performance.now()

    // Get total count
    const total = await prisma.agent.count({ where })

    // Get paginated agents
    const agents = await prisma.agent.findMany({
      where,
      include: {
        capabilities: true,
        skillDependencies: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
    })

    const searchTimeMs = Math.round(performance.now() - startTime)
    const totalPages = Math.ceil(total / pageSize)

    // Calculate facets
    const allAgents = await prisma.agent.findMany({
      where,
      select: {
        category: true,
        avgRating: true,
        pricePerMinute: true,
        pricePerSecond: true,
        pricePerCall: true,
        flatPrice: true,
      },
    })

    const categories: Record<string, number> = {}
    let minPriceFacets = Infinity
    let maxPriceFacets = -Infinity
    const ratingDistribution: Record<string, number> = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }

    for (const agent of allAgents) {
      // Category counts
      categories[agent.category] = (categories[agent.category] || 0) + 1

      // Price range
      const price = Number(agent.pricePerMinute) || Number(agent.pricePerSecond) || Number(agent.pricePerCall) || Number(agent.flatPrice) || 0
      if (price < minPriceFacets) minPriceFacets = price
      if (price > maxPriceFacets) maxPriceFacets = price

      // Rating distribution
      const rating = Math.round(Number(agent.avgRating)).toString()
      if (rating in ratingDistribution) {
        ratingDistribution[rating]++
      }
    }

    if (minPriceFacets === Infinity) minPriceFacets = 0
    if (maxPriceFacets === -Infinity) maxPriceFacets = 0

    return NextResponse.json(
      {
        results: agents.map(transformAgent),
        total,
        page,
        pageSize,
        totalPages,
        facets: {
          categories,
          priceRange: { min: minPriceFacets, max: maxPriceFacets },
          ratingDistribution,
        },
        searchTimeMs,
      },
      {
        status: 200,
        headers: {
          'X-Search-Time-Ms': String(searchTimeMs),
          'X-Total-Count': String(total),
        },
      }
    )
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json(
      { error: 'Search failed', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
