import { NextRequest, NextResponse } from 'next/server'
import { UnlockStakeSchema } from '@/lib/schemas/stake'
import { STAKE_UNLOCK_DELAY_BLOCKS } from '@/constants'
import {
  getStakePositionById,
  updateStakePosition,
  getOrCreateBalance,
  updateBalance,
  deleteStakePosition,
  addUnlockRequest,
  processReadyUnlocks,
} from '@/lib/stores/stake-store'
import type { UnlockRequest } from '@/types'

// POST /api/stake/unlock — Initiate unlock with cooldown
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = UnlockStakeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { positionId, amount } = result.data

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Process any ready unlocks first
    processReadyUnlocks()

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

    // Check if already unlocking
    if (position.unlockingAt !== undefined) {
      return NextResponse.json(
        { error: 'Position is already in unlock cooldown', code: 'ALREADY_UNLOCKING' },
        { status: 400 }
      )
    }

    // Determine unlock amount
    const unlockAmount = amount ?? position.lockedAmount
    if (unlockAmount > position.lockedAmount) {
      return NextResponse.json(
        { error: 'Unlock amount exceeds locked amount', code: 'INVALID_AMOUNT' },
        { status: 400 }
      )
    }

    // Set unlocking_at = now + delay (interpret blocks as milliseconds for simulation)
    const unlockDelayMs = STAKE_UNLOCK_DELAY_BLOCKS * 1000
    const unlockingAt = Date.now() + unlockDelayMs

    // Create unlock request
    const unlockRequest: UnlockRequest = {
      id: `unlock-${Date.now()}`,
      owner: walletAddress,
      amount: unlockAmount,
      requestTime: Date.now(),
      releaseTime: unlockingAt,
      status: 'pending',
    }
    addUnlockRequest(unlockRequest)

    // Update position: reduce locked amount and set unlockingAt
    const partialUnlock = unlockAmount < position.lockedAmount
    if (partialUnlock) {
      updateStakePosition(positionId, {
        lockedAmount: position.lockedAmount - unlockAmount,
        unlockingAt,
      })
    } else {
      updateStakePosition(positionId, { unlockingAt })
    }

    return NextResponse.json(
      {
        data: {
          positionId,
          unlockRequestId: unlockRequest.id,
          amount: unlockAmount,
          unlockingAt,
          releaseTime: unlockingAt,
          status: 'pending',
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
