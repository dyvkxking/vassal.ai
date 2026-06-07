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

const EarningsPayoutPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('earnings-payout'),
  timestamp: z.number().int().positive(),
  data: z.object({
    providerId: z.string(),
    amount: z.number().nonnegative(),
    currency: z.string(),
    periodStart: z.number().int().positive(),
    periodEnd: z.number().int().positive(),
    transactionHash: z.string().optional(),
  })
})

// ============ HANDLER ============

async function handleEarningsPayout(data: z.infer<typeof EarningsPayoutPayloadSchema>['data']) {
  // Log the earnings payout
  console.log('[Webhook] Earnings payout:', {
    providerId: data.providerId,
    amount: data.amount,
    currency: data.currency,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    transactionHash: data.transactionHash,
  })

  // TODO: Update provider earnings in database
  // TODO: Process blockchain transaction if provided
  // TODO: Send confirmation notification

  return { processed: true }
}

// POST /api/webhooks/agents/earnings-payout
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
    const parseResult = parseWebhookEvent('earnings-payout', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = EarningsPayoutPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleEarningsPayout(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}