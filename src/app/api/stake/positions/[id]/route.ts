import { NextRequest, NextResponse } from 'next/server'
import { StakePositionSchema } from '@/lib/schemas/stake'
import { getStakePositionById } from '@/lib/stores/stake-store'

// GET /api/stake/positions/[id] — Get a specific stake position
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  const { id } = await params

  const position = getStakePositionById(id)
  if (!position) {
    return NextResponse.json(
      { error: 'Stake position not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Verify ownership
  if (position.owner !== walletAddress) {
    return NextResponse.json(
      { error: 'Access denied', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  const result = StakePositionSchema.safeParse(position)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Failed to validate position', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: result.data }, { status: 200 })
}
