import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS, MOCK_AGENTS, getAgentById, getNodeById } from '@/lib/mock-data'
import { CreateSessionSchema, SessionSchema } from '@/lib/schemas/sessions'
import { SessionFiltersSchema } from '@/lib/schemas/api'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX, SESSION_STATUS } from '@/constants'

// In-memory session store (mutable for demo purposes)
let sessions = [...MOCK_SESSIONS]

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

  // Apply filters using SessionFiltersSchema
  let filtered = [...sessions]

  if (status) {
    const statusResult = SessionFiltersSchema.shape.status.safeParse(status)
    if (statusResult.success) {
      filtered = filtered.filter((s) => s.status === statusResult.data)
    }
  }

  if (agentId) {
    filtered = filtered.filter((s) => s.agentId === agentId)
  }

  if (client) {
    filtered = filtered.filter((s) => s.client === client)
  }

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = filtered.slice(offset, offset + pageSize)

  // Validate response data
  const validated = paginated.map((session) => {
    const result = SessionSchema.safeParse(session)
    if (!result.success) {
      return null
    }
    return result.data
  }).filter(Boolean)

  return NextResponse.json(
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
    const agent = getAgentById(data.agentId)
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
    const node = getNodeById(data.providerNode)
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
    const newSession = {
      id: `session-${Date.now()}`,
      client: data.client,
      agentId: data.agentId,
      providerNode: data.providerNode,
      status: 'pending' as const,
      slaParams: agent.slaParams,
      startTime: Date.now(),
      tpmUsed: 0,
      totalCost: 0,
      latencyMetrics: { avgLatencyMs: 0, p50LatencyMs: 0, p95LatencyMs: 0, p99LatencyMs: 0, breaches: 0 },
      slashEvents: [],
      learningSignal: undefined,
    }

    // Validate the created session
    const sessionResult = SessionSchema.safeParse(newSession)
    if (!sessionResult.success) {
      return NextResponse.json(
        { error: 'Failed to create session', code: 'INTERNAL_ERROR', details: sessionResult.error.flatten() },
        { status: 500 }
      )
    }

    // Add to in-memory store
    sessions.unshift(sessionResult.data)

    return NextResponse.json({ data: sessionResult.data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}