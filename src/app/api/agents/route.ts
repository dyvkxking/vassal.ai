import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transformAgent } from '@/lib/db/transformers'
import { CreateAgentSchema } from '@/lib/schemas/agents'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// GET /api/agents — List agents with pagination, filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Filters
  const category = searchParams.get('category')
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.toLowerCase()
  const minRating = searchParams.get('minRating')
  const maxPrice = searchParams.get('maxPrice')

  // Build Prisma where clause
  const where: Record<string, unknown> = {}

  if (category) {
    where.category = category
  }

  if (status) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (minRating) {
    where.avgRating = { gte: parseFloat(minRating) }
  }

  if (maxPrice) {
    where.OR = [
      { pricePerMinute: { lte: parseFloat(maxPrice) } },
      { pricePerSecond: { lte: parseFloat(maxPrice) } },
      { pricePerCall: { lte: parseFloat(maxPrice) } },
      { flatPrice: { lte: parseFloat(maxPrice) } },
    ]
  }

  try {
    // Get total count
    const total = await prisma.agent.count({ where })

    // Get paginated agents with relations
    const agents = await prisma.agent.findMany({
      where,
      include: {
        capabilities: true,
        skillDependencies: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { qualityScore: 'desc' },
    })

    const totalPages = Math.ceil(total / pageSize)

    const response = NextResponse.json(
      { data: agents.map(transformAgent), total, page, pageSize, totalPages },
      {
        status: 200,
        headers: {
          'X-Total-Count': String(total),
          'X-Page': String(page),
          'X-Per-Page': String(pageSize),
        },
      }
    )

    return response
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// POST /api/agents — Create agent (authenticated, builder role)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = CreateAgentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Verify creator matches authenticated wallet
    if (data.creator !== walletAddress) {
      return NextResponse.json(
        { error: 'Creator address must match authenticated wallet', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Check role
    const role = request.headers.get('x-role')
    if (role !== 'creator' && role !== 'builder') {
      return NextResponse.json(
        { error: 'Creator role required to create agents', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Extract pricing type and values
    const pricing = data.pricing
    let pricingType = 'per_minute'
    let pricePerMinute: number | undefined
    let pricePerSecond: number | undefined
    let pricePerCall: number | undefined
    let flatPrice: number | undefined

    if (pricing.type === 'per_minute') {
      pricingType = 'per_minute'
      pricePerMinute = pricing.pricePerMinute
    } else if (pricing.type === 'per_second') {
      pricingType = 'per_second'
      pricePerSecond = pricing.pricePerSecond
    } else if (pricing.type === 'flat_rate') {
      pricingType = 'flat_rate'
      flatPrice = pricing.flatPrice
    } else if (pricing.type === 'tiered' && pricing.tiers) {
      pricingType = 'tiered'
      // Use first tier for base pricing
      pricePerMinute = pricing.tiers[0]?.pricePerMinute
    }

    // Create agent in database
    const newAgent = await prisma.agent.create({
      data: {
        creator: data.creator,
        name: data.name,
        description: data.description,
        category: data.category.replace('ai-ml', 'ai_ml') as any,
        pricingType,
        pricePerMinute,
        pricePerSecond,
        pricePerCall,
        flatPrice,
        qualityScore: 0,
        totalSessions: BigInt(0),
        avgRating: 0,
        status: 'draft',
        version: '1.0.0',
        learningEnabled: data.learningEnabled ?? false,
        capabilities: {
          create: data.capabilities.map((cap) => ({
            name: cap.name,
            description: cap.description,
            tpmRequired: cap.tpmRequired,
            category: cap.category,
          })),
        },
        skillDependencies: {
          create: data.skillDependencies.map((skillId) => ({
            skillId,
          })),
        },
      },
      include: {
        capabilities: true,
        skillDependencies: true,
      },
    })

    return NextResponse.json({ data: transformAgent(newAgent) }, { status: 201 })
  } catch (error) {
    console.error('Failed to create agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
