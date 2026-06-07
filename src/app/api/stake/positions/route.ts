import { NextRequest, NextResponse } from 'next/server'
import { StakePositionSchema } from '@/lib/schemas/stake'
import { getStakePositionsByOwner } from '@/lib/stores/stake-store'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// GET /api/stake/positions — List all stake positions for authenticated user
export async function GET(request: NextRequest) {
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

  // Filter by purpose (optional)
  const purpose = searchParams.get('purpose')

  // Get user's positions
  let positions = getStakePositionsByOwner(walletAddress)

  // Apply purpose filter
  if (purpose) {
    positions = positions.filter((p) => p.purpose === purpose)
  }

  // Sort by createdAt desc
  positions.sort((a, b) => b.createdAt - a.createdAt)

  // Pagination
  const total = positions.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = positions.slice(offset, offset + pageSize)

  // Validate response data
  const validated = paginated.map((position) => {
    const result = StakePositionSchema.safeParse(position)
    if (!result.success) return null
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
