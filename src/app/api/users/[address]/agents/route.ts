import { NextRequest, NextResponse } from 'next/server'
import { MOCK_AGENTS } from '@/lib/mock-data'
import { AgentSchema } from '@/lib/schemas/agents'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

interface RouteParams {
  params: Promise<{ address: string }>
}

// GET /api/users/[address]/agents — Get user's created agents
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { address } = await params
  const { searchParams } = new URL(request.url)

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Filter agents by creator address
  const userAgents = MOCK_AGENTS.filter(
    (a) => a.creator.toLowerCase() === address.toLowerCase()
  )

  // Optional status filter
  const status = searchParams.get('status')
  let filtered = userAgents
  if (status) {
    filtered = userAgents.filter((a) => a.status === status)
  }

  // Sort by createdAt descending
  filtered.sort((a, b) => b.createdAt - a.createdAt)

  // Validate response data
  const validated = filtered.map((agent) => {
    const result = AgentSchema.safeParse(agent)
    return result.success ? result.data : null
  }).filter(Boolean)

  // Pagination on validated items
  const total = validated.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = validated.slice(offset, offset + pageSize)

  return NextResponse.json(
    {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages,
      address,
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