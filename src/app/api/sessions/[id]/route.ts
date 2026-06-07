import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS } from '@/lib/mock-data'
import { SessionSchema, UpdateSessionSchema } from '@/lib/schemas/sessions'
import { SESSION_STATUS } from '@/constants'

// In-memory session store (mutable for demo purposes)
let sessions = [...MOCK_SESSIONS]

// Helper to find session index by ID
function findSessionIndex(id: string): number {
  return sessions.findIndex((s) => s.id === id)
}

// GET /api/sessions/[id] — Get session by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sessionIndex = findSessionIndex(id)

  if (sessionIndex === -1) {
    return NextResponse.json(
      { error: 'Session not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  const result = SessionSchema.safeParse(sessions[sessionIndex])
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid session data', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: result.data }, { status: 200 })
}

// PATCH /api/sessions/[id] — Update session (end, rate, feedback)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionIndex = findSessionIndex(id)

    if (sessionIndex === -1) {
      return NextResponse.json(
        { error: 'Session not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Validate request body
    const result = UpdateSessionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const session = sessions[sessionIndex]

    // Verify client owns this session
    if (session.client !== walletAddress) {
      return NextResponse.json(
        { error: 'You can only update your own sessions', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Handle status transitions
    if (data.status) {
      // Only allow certain transitions
      const allowedTransitions: Record<string, string[]> = {
        [SESSION_STATUS.PENDING]: [SESSION_STATUS.ACTIVE, SESSION_STATUS.CANCELLED],
        [SESSION_STATUS.ACTIVE]: [SESSION_STATUS.COMPLETED, SESSION_STATUS.FAILED, SESSION_STATUS.CANCELLED],
        [SESSION_STATUS.COMPLETED]: [],
        [SESSION_STATUS.FAILED]: [],
        [SESSION_STATUS.CANCELLED]: [],
        [SESSION_STATUS.DISPUTED]: [],
      }

      const currentStatus = session.status
      if (!allowedTransitions[currentStatus]?.includes(data.status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${currentStatus} to ${data.status}`, code: 'INVALID_TRANSITION' },
          { status: 400 }
        )
      }

      // If ending session, set endTime
      if (data.status === SESSION_STATUS.COMPLETED || data.status === SESSION_STATUS.FAILED || data.status === SESSION_STATUS.CANCELLED) {
        session.endTime = Date.now()
      }
    }

    // Update session fields
    if (data.status) session.status = data.status
    if (data.rating !== undefined) session.rating = data.rating
    if (data.feedback !== undefined) session.feedback = data.feedback

    // Validate updated session
    const updatedResult = SessionSchema.safeParse(session)
    if (!updatedResult.success) {
      return NextResponse.json(
        { error: 'Failed to update session', code: 'INTERNAL_ERROR', details: updatedResult.error.flatten() },
        { status: 500 }
      )
    }

    sessions[sessionIndex] = updatedResult.data

    return NextResponse.json({ data: updatedResult.data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}

// DELETE /api/sessions/[id] — Cancel session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sessionIndex = findSessionIndex(id)

  if (sessionIndex === -1) {
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

  const session = sessions[sessionIndex]

  // Verify client owns this session
  if (session.client !== walletAddress) {
    return NextResponse.json(
      { error: 'You can only cancel your own sessions', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  // Can only cancel pending or active sessions
  if (session.status !== SESSION_STATUS.PENDING && session.status !== SESSION_STATUS.ACTIVE) {
    return NextResponse.json(
      { error: 'Can only cancel pending or active sessions', code: 'INVALID_STATUS' },
      { status: 400 }
    )
  }

  // Cancel the session
  session.status = SESSION_STATUS.CANCELLED
  session.endTime = Date.now()

  return NextResponse.json({ data: { id, status: 'cancelled' } }, { status: 200 })
}