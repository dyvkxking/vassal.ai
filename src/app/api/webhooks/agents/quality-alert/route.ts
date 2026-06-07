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

const QualityAlertPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('quality-alert'),
  timestamp: z.number().int().positive(),
  data: z.object({
    agentId: z.string(),
    alertType: z.enum(['low_quality', 'sla_breach', 'rating_drop']),
    severity: z.enum(['info', 'warning', 'critical']),
    currentScore: z.number().min(0).max(1).optional(),
    previousScore: z.number().min(0).max(1).optional(),
    message: z.string(),
  })
})

// ============ HANDLER ============

async function handleQualityAlert(data: z.infer<typeof QualityAlertPayloadSchema>['data']) {
  // Log the quality alert
  console.log('[Webhook] Quality alert:', {
    agentId: data.agentId,
    alertType: data.alertType,
    severity: data.severity,
    currentScore: data.currentScore,
    message: data.message,
  })

  // TODO: Update agent quality score
  // TODO: Send notification to builder
  // TODO: Trigger SLA penalty if applicable

  return { processed: true }
}

// POST /api/webhooks/agents/quality-alert
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
    const parseResult = parseWebhookEvent('quality-alert', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = QualityAlertPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleQualityAlert(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}