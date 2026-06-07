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

const ProposalPassedPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.literal('proposal-passed'),
  timestamp: z.number().int().positive(),
  data: z.object({
    proposalId: z.string(),
    votesFor: z.number().nonnegative(),
    votesAgainst: z.number().nonnegative(),
    votesAbstain: z.number().nonnegative(),
    totalVotingPower: z.number().nonnegative(),
    quorumReached: z.boolean(),
    executionPlan: z.string().optional(),
  })
})

// ============ HANDLER ============

async function handleProposalPassed(data: z.infer<typeof ProposalPassedPayloadSchema>['data']) {
  // Log the proposal passed event
  console.log('[Webhook] Proposal passed:', {
    proposalId: data.proposalId,
    votesFor: data.votesFor,
    votesAgainst: data.votesAgainst,
    quorumReached: data.quorumReached,
  })

  // TODO: Update proposal status in database
  // TODO: Queue proposal for execution
  // TODO: Notify proposal author and voters

  return { processed: true }
}

// POST /api/webhooks/governance/proposal-passed
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
    const parseResult = parseWebhookEvent('proposal-passed', payload)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error, code: 'INVALID_PAYLOAD' },
        { status: 400 }
      )
    }

    const validationResult = ProposalPassedPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Process event (async)
    handleProposalPassed(validationResult.data.data).catch(console.error)

    // Return 200 quickly
    return NextResponse.json({ received: true, eventId: payload.eventId }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Bad request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}