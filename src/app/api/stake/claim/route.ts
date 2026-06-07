import { NextRequest, NextResponse } from 'next/server'
import { ClaimRewardsSchema } from '@/lib/schemas/stake'
import { getStakePositionById, getOrCreateBalance, updateBalance } from '@/lib/stores/stake-store'

// Simulated APY for reward calculation (5% annual) — must match rewards route
const SIMULATED_APY = 0.05
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60

// POST /api/stake/claim — Claim earned rewards from a stake position
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = ClaimRewardsSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { positionId } = result.data

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const position = getStakePositionById(positionId)
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

    // Check if position is in unlock cooldown (cannot claim during unlock)
    if (position.unlockingAt !== undefined) {
      return NextResponse.json(
        { error: 'Cannot claim rewards while position is in unlock cooldown', code: 'POSITION_UNLOCKING' },
        { status: 400 }
      )
    }

    // Calculate pending rewards
    const now = Date.now()
    const timeStakedSeconds = (now - position.createdAt) / 1000
    const pendingRewards = position.lockedAmount * (SIMULATED_APY / SECONDS_PER_YEAR) * timeStakedSeconds
    const claimableAmount = Math.round(pendingRewards * 10000) / 10000

    if (claimableAmount <= 0) {
      return NextResponse.json(
        { error: 'No rewards available to claim', code: 'NO_REWARDS' },
        { status: 400 }
      )
    }

    // Transfer rewards to user's free balance
    const balance = getOrCreateBalance(walletAddress)
    updateBalance(walletAddress, claimableAmount, 0)

    return NextResponse.json(
      {
        data: {
          positionId,
          claimedAmount: claimableAmount,
          newFreeBalance: balance.freeBalance,
          currency: 'MESH',
          claimedAt: now,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}
