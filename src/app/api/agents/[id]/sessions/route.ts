import { NextRequest, NextResponse } from 'next/server'
import { getAgentById, MOCK_SESSIONS } from '@/lib/mock-data'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/agents/[id]/sessions — List sessions for agent (paginated)
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const agent = getAgentById(id)

  if (!agent) {
    return NextResponse.json(
      { error: 'Agent not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  const { searchParams } = new URL(request.url)

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Filter sessions for this agent
  let sessions = MOCK_SESSIONS.filter((s) => s.agentId === id)

  // Filter by status if provided
  const status = searchParams.get('status')
  if (status) {
    sessions = sessions.filter((s) => s.status === status)
  }

  // Sort by startTime descending (most recent first)
  sessions.sort((a, b) => b.startTime - a.startTime)

  // Pagination
  const total = sessions.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = sessions.slice(offset, offset + pageSize)

  return NextResponse.json(
    {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages,
      agentId: id,
      agentName: agent.name,
    },
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