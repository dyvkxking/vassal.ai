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

const ProposalFailedPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('proposal-failed'),
  timestamp: z.number().int().positive(),
  data: z.object({
    proposalId: z.string(),
    votesFor: z.number().nonnegative(),
    votesAgainst: z.number().nonnegative(),
    votesAbstain: z.number().nonnegative(),
    totalVotingPower: z.number().nonnegative(),
    quorumReached: z.boolean(),
    reason: z.string().optional(),
  })
})

// ============ HANDLER ============

async function handleProposalFailed(data: z.infer<typeof ProposalFailedPayloadSchema>['data']) {
  // Log the proposal failed event
  console.log('[Webhook] Proposal failed:', {
    proposalId: data.proposalId,
    votesFor: data.votesFor,
    votesAgainst: data.votesAgainst,
    quorumReached: data.quorumReached,
    reason: data.reason,
  })

  // TODO: Update proposal status in database
  // TODO: Notify proposal author

  return { processed: true }
}

// POST /api/webhooks/governance/proposal-failed
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
    const parseResult = parseWebhookEvent('proposal-failed', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = ProposalFailedPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleProposalFailed(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}