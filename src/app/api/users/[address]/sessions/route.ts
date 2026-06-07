import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS } from '@/lib/mock-data'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

interface RouteParams {
  params: Promise<{ address: string }>
}

// GET /api/users/[address]/sessions — Get user's session history
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

  // Filter sessions by client address
  const userSessions = MOCK_SESSIONS.filter(
    (s) => s.client.toLowerCase() === address.toLowerCase()
  )

  // Optional status filter
  const status = searchParams.get('status')
  let filtered = userSessions
  if (status) {
    filtered = userSessions.filter((s) => s.status === status)
  }

  // Sort by startTime descending
  filtered.sort((a, b) => b.startTime - a.startTime)

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = filtered.slice(offset, offset + pageSize)

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