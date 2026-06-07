import { NextRequest, NextResponse } from 'next/server'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { AgentSchema, CreateAgentSchema } from '@/lib/schemas/agents'
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

  // Apply filters
  let filtered = [...MOCK_AGENTS]

  if (category) {
    filtered = filtered.filter((a) => a.category === category)
  }

  if (status) {
    filtered = filtered.filter((a) => a.status === status)
  }

  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search)
    )
  }

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = filtered.slice(offset, offset + pageSize)

  // Validate response data
  const validated = paginated.map((agent) => {
    const result = AgentSchema.safeParse(agent)
    if (!result.success) {
      return null
    }
    return result.data
  }).filter(Boolean)

  const response = NextResponse.json(
    { data: validated, total, page, pageSize, totalPages },
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

    // Check authentication (mock: check for wallet address in header)
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

    // Check role (mock: check for role header)
    const role = request.headers.get('x-role')
    if (role !== 'creator' && role !== 'builder') {
      return NextResponse.json(
        { error: 'Creator role required to create agents', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Create new agent
    const newAgent = {
      ...data,
      id: `agent-${Date.now()}`,
      qualityScore: 0,
      totalSessions: 0,
      avgRating: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft' as const,
      version: '1.0.0',
    }

    // Validate the created agent
    const agentResult = AgentSchema.safeParse(newAgent)
    if (!agentResult.success) {
      return NextResponse.json(
        { error: 'Failed to create agent', code: 'INTERNAL_ERROR', details: agentResult.error.flatten() },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: agentResult.data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}