import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  verifyWebhookSignature,
  verifyWebhookTimestamp,
  extractSignature,
  extractTimestamp,
  parseWebhookEvent
} from '@/lib/webhooks/verify'

// Webhook secret from environment
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'webhook-secret'

// ============ PAYLOAD SCHEMA ============

const RewardsClaimedPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('rewards-claimed'),
  timestamp: z.number().int().positive(),
  data: z.object({
    positionId: z.string(),
    owner: z.string(),
    amount: z.number().nonnegative(),
    purpose: z.enum(['provider', 'agent', 'delegation']),
    associatedEntity: z.string().optional(),
    transactionHash: z.string(),
    blockNumber: z.number().int().positive(),
  })
})

// ============ HANDLER ============

async function handleRewardsClaimed(data: z.infer<typeof RewardsClaimedPayloadSchema>['data']) {
  // Log the rewards claimed event
  console.log('[Webhook] Rewards claimed:', {
    positionId: data.positionId,
    owner: data.owner,
    amount: data.amount,
    purpose: data.purpose,
    transactionHash: data.transactionHash,
  })

  // TODO: Update stake position with new rewards
  // TODO: Record transaction in history
  // TODO: Trigger notification to owner

  return { processed: true }
}

// POST /api/webhooks/stake/rewards-claimed
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // Verify signature
    const signature = extractSignature(request.headers)
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature', code: 'MISSING_SIGNATURE' },
        { status: 401 }
      )
    }

    if (!verifyWebhookSignature(body, signature, WEBHOOK_SECRET)) {
      return NextResponse.json(
        { error: 'Invalid signature', code: 'INVALID_SIGNATURE' },
        { status: 401 }
      )
    }

    // Verify timestamp
    const timestamp = extractTimestamp(request.headers)
    if (timestamp && !verifyWebhookTimestamp(timestamp)) {
      return NextResponse.json(
        { error: 'Request timestamp too old', code: 'TIMESTAMP_EXPIRED' },
        { status: 401 }
      )
    }

    // Parse and validate payload
    const payload = JSON.parse(body)
    const parseResult = parseWebhookEvent('rewards-claimed', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = RewardsClaimedPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleRewardsClaimed(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}