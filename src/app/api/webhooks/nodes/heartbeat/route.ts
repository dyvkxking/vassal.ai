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

const HeartbeatPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('heartbeat'),
  timestamp: z.number().int().positive(),
  data: z.object({
    nodeId: z.string(),
    operator: z.string(),
    timestamp: z.number().int().positive(),
    loadMetrics: z.object({
      cpuUsagePercent: z.number().min(0).max(100),
      memoryUsagePercent: z.number().min(0).max(100),
      diskUsagePercent: z.number().min(0).max(100),
      networkInBps: z.number().nonnegative(),
      networkOutBps: z.number().nonnegative(),
    }),
  })
})

// ============ HANDLER ============

async function handleHeartbeat(data: z.infer<typeof HeartbeatPayloadSchema>['data']) {
  // Log the heartbeat
  console.log('[Webhook] Node heartbeat:', {
    nodeId: data.nodeId,
    operator: data.operator,
    loadMetrics: data.loadMetrics,
  })

  // TODO: Update node lastHeartbeat in database
  // TODO: Check if node should be marked offline based on heartbeat frequency

  return { processed: true }
}

// POST /api/webhooks/nodes/heartbeat
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
    const parseResult = parseWebhookEvent('heartbeat', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = HeartbeatPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleHeartbeat(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}