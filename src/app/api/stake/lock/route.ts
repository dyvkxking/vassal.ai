import { NextRequest, NextResponse } from 'next/server'
import { LockStakeSchema, StakePositionSchema } from '@/lib/schemas/stake'
import { getOrCreateBalance, updateBalance, addStakePosition } from '@/lib/stores/stake-store'
import type { StakePosition } from '@/types'

// POST /api/stake/lock — Lock stake to create a position
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = LockStakeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { amount, purpose, associatedEntity } = result.data

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Check sufficient free balance
    const balance = getOrCreateBalance(walletAddress)
    if (balance.freeBalance < amount) {
      return NextResponse.json(
        { error: 'Insufficient free balance', code: 'INSUFFICIENT_BALANCE' },
        { status: 400 }
      )
    }

    // Create stake position
    const newPosition: StakePosition = {
      id: `stake-${Date.now()}`,
      owner: walletAddress,
      amount,
      lockedAmount: amount,
      purpose,
      associatedEntity,
      createdAt: Date.now(),
      unlockingAt: undefined,
    }

    // Validate the created position
    const positionResult = StakePositionSchema.safeParse(newPosition)
    if (!positionResult.success) {
      return NextResponse.json(
        { error: 'Failed to create stake position', code: 'INTERNAL_ERROR', details: positionResult.error.flatten() },
        { status: 500 }
      )
    }

    // Update balances: move amount from free to locked
    updateBalance(walletAddress, -amount, amount)

    // Add position to store
    addStakePosition(newPosition)

    return NextResponse.json({ data: positionResult.data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}
