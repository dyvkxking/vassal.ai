import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS, getNodeById } from '@/lib/mock-data'
import { SlashEventSchema, SessionSchema } from '@/lib/schemas/sessions'
import { SLA_BREACH_TYPES } from '@/constants'

// In-memory session store (mutable for demo purposes)
let sessions = [...MOCK_SESSIONS]

// Helper to find session by ID
function findSession(id: string) {
  return sessions.find((s) => s.id === id)
}

// POST /api/sessions/[id]/slash — Record slash event (provider)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = findSession(id)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Verify provider owns the node
    const node = getNodeById(session.providerNode)
    if (!node) {
      return NextResponse.json(
        { error: 'Provider node not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    if (node.operator !== walletAddress) {
      return NextResponse.json(
        { error: 'You can only record slash events for your own nodes', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate slash event
    const result = SlashEventSchema.safeParse({
      ...body,
      id: `slash-${Date.now()}`,
      sessionId: id,
      timestamp: Date.now(),
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    // Add slash event to session
    session.slashEvents.push(result.data)

    // Update latency metrics breaches if this is a latency breach
    if (result.data.type === SLA_BREACH_TYPES.LATENCY || result.data.type === SLA_BREACH_TYPES.TPM) {
      session.latencyMetrics.breaches += 1
    }

    // Validate updated session
    const sessionResult = SessionSchema.safeParse(session)
    if (!sessionResult.success) {
      return NextResponse.json(
        { error: 'Failed to record slash event', code: 'INTERNAL_ERROR', details: sessionResult.error.flatten() },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}