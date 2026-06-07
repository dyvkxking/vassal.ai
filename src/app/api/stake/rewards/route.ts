import { NextRequest, NextResponse } from 'next/server'
import { getStakePositionsByOwner } from '@/lib/stores/stake-store'

// Simulated APY for reward calculation (5% annual)
const SIMULATED_APY = 0.05
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60

// GET /api/stake/rewards — Calculate pending rewards for authenticated user
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
  const positionId = searchParams.get('positionId')

  const positions = getStakePositionsByOwner(walletAddress)

  // Filter to specific position if provided
  const targetPositions = positionId
    ? positions.filter((p) => p.id === positionId)
    : positions

  if (positionId && targetPositions.length === 0) {
    return NextResponse.json(
      { error: 'Stake position not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Calculate rewards for each position
  const now = Date.now()
  const rewards = targetPositions.map((position) => {
    // Skip positions that are already unlocking
    if (position.unlockingAt !== undefined) {
      return {
        positionId: position.id,
        lockedAmount: position.lockedAmount,
        pendingRewards: 0,
        lastUpdated: now,
        note: 'Position is in unlock cooldown',
      }
    }

    // Calculate time staked in seconds
    const timeStakedSeconds = (now - position.createdAt) / 1000

    // Calculate pending rewards: lockedAmount * (APY / seconds_per_year) * time_staked
    const pendingRewards = position.lockedAmount * (SIMULATED_APY / SECONDS_PER_YEAR) * timeStakedSeconds

    return {
      positionId: position.id,
      lockedAmount: position.lockedAmount,
      pendingRewards: Math.round(pendingRewards * 10000) / 10000, // 4 decimal places
      lastUpdated: now,
      apy: SIMULATED_APY,
    }
  })

  const totalPendingRewards = rewards.reduce((sum, r) => sum + r.pendingRewards, 0)

  return NextResponse.json(
    {
      data: {
        positions: rewards,
        totalPendingRewards: Math.round(totalPendingRewards * 10000) / 10000,
        currency: 'MESH',
        apy: SIMULATED_APY,
      },
    },
    { status: 200 }
  )
}
