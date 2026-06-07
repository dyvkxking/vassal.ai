import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS } from '@/lib/mock-data'
import { LatencyMetricsSchema } from '@/lib/schemas/sessions'

// In-memory session store (mutable for demo purposes)
let sessions = [...MOCK_SESSIONS]

// Helper to find session by ID
function findSession(id: string) {
  return sessions.find((s) => s.id === id)
}

// GET /api/sessions/[id]/metrics — Get latency metrics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = findSession(id)

  if (!session) {
    return NextResponse.json(
      { error: 'Session not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Validate latency metrics
  const result = LatencyMetricsSchema.safeParse(session.latencyMetrics)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid latency metrics', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    data: {
      sessionId: id,
      metrics: result.data,
      slaParams: session.slaParams,
      breaches: session.slashEvents.length,
    }
  }, { status: 200 })
}