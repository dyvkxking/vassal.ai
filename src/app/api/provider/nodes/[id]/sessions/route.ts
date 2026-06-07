import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS } from '@/lib/mock-data'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// GET /api/provider/nodes/[id]/sessions — Get sessions for a specific node
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Check authentication
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Filter sessions by provider node id
  let filtered = MOCK_SESSIONS.filter((s) => s.providerNode === id)

  // Sort by startTime desc
  filtered.sort((a, b) => b.startTime - a.startTime)

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = filtered.slice(offset, offset + pageSize)

  return NextResponse.json(
    { data: paginated, total, page, pageSize, totalPages },
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