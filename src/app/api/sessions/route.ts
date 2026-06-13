import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transformSession } from '@/lib/db/transformers'
import { CreateSessionSchema } from '@/lib/schemas/sessions'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// GET /api/sessions — List sessions with pagination and filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Filters
  const status = searchParams.get('status')
  const agentId = searchParams.get('agentId')
  const client = searchParams.get('client')
  const providerNodeId = searchParams.get('providerNodeId')

  // Build Prisma where clause
  const where: Record<string, unknown> = {}

  if (status) {
    where.status = status
  }

  if (agentId) {
    where.agentId = agentId
  }

  if (client) {
    where.client = client
  }

  if (providerNodeId) {
    where.providerNodeId = providerNodeId
  }

  try {
    // Get total count
    const total = await prisma.session.count({ where })

    // Get paginated sessions with relations
    const sessions = await prisma.session.findMany({
      where,
      include: {
        slashEvents: true,
        agent: true,
        providerNode: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { startTime: 'desc' },
    })

    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json(
      { data: sessions.map(transformSession), total, page, pageSize, totalPages },
      {
        status: 200,
        headers: {
          'X-Total-Count': String(total),
          'X-Page': String(page),
          'X-Per-Page': String(pageSize),
        },
      }
    )
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// POST /api/sessions — Create/start new session (requires auth, validates stake)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = CreateSessionSchema.safeParse(body)
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

    // Verify client matches authenticated wallet
    if (data.client !== walletAddress) {
      return NextResponse.json(
        { error: 'Client address must match authenticated wallet', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Check agent exists and is active
    const agent = await prisma.agent.findUnique({
      where: { id: data.agentId },
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    if (agent.status !== 'active') {
      return NextResponse.json(
        { error: 'Agent is not active', code: 'AGENT_NOT_ACTIVE' },
        { status: 400 }
      )
    }

    // Check provider node exists and is online
    const node = await prisma.providerNode.findUnique({
      where: { id: data.providerNode },
    })

    if (!node) {
      return NextResponse.json(
        { error: 'Provider node not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    if (node.status !== 'online') {
      return NextResponse.json(
        { error: 'Provider node is not online', code: 'NODE_NOT_ONLINE' },
        { status: 400 }
      )
    }

    // Create new session
    const newSession = await prisma.session.create({
      data: {
        client: data.client,
        agentId: data.agentId,
        providerNodeId: data.providerNode,
        status: 'pending',
        latencyThresholdMs: 2000,
        tpmCap: 100000,
        uptimeGuaranteePercent:99,
        minStakeRequired: 0,
        startTime: new Date(),
      },
      include: {
        slashEvents: true,
      },
    })

    return NextResponse.json({ data: transformSession(newSession) }, { status: 201 })
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { error: 'Failed to create session', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
