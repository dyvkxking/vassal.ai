import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS } from '@/lib/mock-data'
import { SessionSchema } from '@/lib/schemas/sessions'
import { SESSION_STATUS } from '@/constants'

// In-memory session store (mutable for demo purposes)
let sessions = [...MOCK_SESSIONS]

// Helper to find session by ID
function findSession(id: string) {
  return sessions.find((s) => s.id === id)
}

// POST /api/sessions/[id]/complete — Mark session completed
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

    // Client can complete their own sessions
    // Provider can also complete sessions for their nodes (check via header)
    const role = request.headers.get('x-role')
    const isClient = session.client === walletAddress
    const isProvider = role === 'provider' && session.providerNode

    if (!isClient && !isProvider) {
      return NextResponse.json(
        { error: 'Not authorized to complete this session', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Can only complete pending or active sessions
    if (session.status !== SESSION_STATUS.PENDING && session.status !== SESSION_STATUS.ACTIVE) {
      return NextResponse.json(
        { error: 'Can only complete pending or active sessions', code: 'INVALID_STATUS' },
        { status: 400 }
      )
    }

    // Complete the session
    session.status = SESSION_STATUS.COMPLETED
    session.endTime = Date.now()

    // Validate updated session
    const result = SessionSchema.safeParse(session)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to complete session', code: 'INTERNAL_ERROR', details: result.error.flatten() },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: result.data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}