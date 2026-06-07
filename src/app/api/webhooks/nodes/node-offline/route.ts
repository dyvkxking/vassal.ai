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

const NodeOfflinePayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('node-offline'),
  timestamp: z.number().int().positive(),
  data: z.object({
    nodeId: z.string(),
    operator: z.string(),
    lastHeartbeat: z.number().int().positive(),
    offlineSince: z.number().int().positive(),
    reason: z.string().optional(),
  })
})

// ============ HANDLER ============

async function handleNodeOffline(data: z.infer<typeof NodeOfflinePayloadSchema>['data']) {
  // Log the offline event
  console.log('[Webhook] Node offline:', {
    nodeId: data.nodeId,
    operator: data.operator,
    offlineSince: data.offlineSince,
    reason: data.reason,
  })

  // TODO: Update node status in database
  // TODO: Trigger stake unlocking if offline threshold exceeded
  // TODO: Notify node operator

  return { processed: true }
}

// POST /api/webhooks/nodes/offline
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
    const parseResult = parseWebhookEvent('node-offline', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = NodeOfflinePayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleNodeOffline(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}