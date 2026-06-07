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

const SessionCompletedPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('session-completed'),
  timestamp: z.number().int().positive(),
  data: z.object({
    sessionId: z.string(),
    agentId: z.string(),
    providerNode: z.string(),
    client: z.string(),
    durationMs: z.number().nonnegative(),
    tpmUsed: z.number().nonnegative(),
    totalCost: z.number().nonnegative(),
    qualityScore: z.number().min(0).max(1).optional(),
  })
})

// ============ HANDLER ============

async function handleSessionCompleted(data: z.infer<typeof SessionCompletedPayloadSchema>['data']) {
  // Log the session completion event
  console.log('[Webhook] Session completed:', {
    sessionId: data.sessionId,
    agentId: data.agentId,
    providerNode: data.providerNode,
    durationMs: data.durationMs,
    tpmUsed: data.tpmUsed,
    totalCost: data.totalCost,
  })

  // TODO: Update session status in database
  // TODO: Update agent statistics
  // TODO: Trigger learning signal if enabled

  return { processed: true }
}

// POST /api/webhooks/agents/session-completed
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
    const parseResult = parseWebhookEvent('session-completed', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = SessionCompletedPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleSessionCompleted(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}