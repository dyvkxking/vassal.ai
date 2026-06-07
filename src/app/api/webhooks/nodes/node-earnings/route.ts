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

const NodeEarningsPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('node-earnings'),
  timestamp: z.number().int().positive(),
  data: z.object({
    nodeId: z.string(),
    operator: z.string(),
    earningsTotal: z.number().nonnegative(),
    earningsPending: z.number().nonnegative(),
    periodStart: z.number().int().positive(),
    periodEnd: z.number().int().positive(),
  })
})

// ============ HANDLER ============

async function handleNodeEarnings(data: z.infer<typeof NodeEarningsPayloadSchema>['data']) {
  // Log the earnings update
  console.log('[Webhook] Node earnings update:', {
    nodeId: data.nodeId,
    operator: data.operator,
    earningsTotal: data.earningsTotal,
    earningsPending: data.earningsPending,
  })

  // TODO: Update node earnings in database
  // TODO: Trigger payout if threshold reached

  return { processed: true }
}

// POST /api/webhooks/nodes/earnings
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
    const parseResult = parseWebhookEvent('node-earnings', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = NodeEarningsPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleNodeEarnings(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}