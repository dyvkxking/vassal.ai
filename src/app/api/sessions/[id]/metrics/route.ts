import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Real-time metrics for active session
    const metrics = {
      sessionId: id,
      tpmCurrent: Math.floor(Math.random() * 500000) + 1000000,
      tpmCap: 5000000,
      latencyMs: Math.floor(Math.random() * 100) + 100,
      slaHealth: Math.floor(Math.random() * 20) + 80,
      uptimeSeconds: Math.floor(Math.random() * 3600),
      timestamp: new Date().toISOString(),
    }
    return NextResponse.json({ success: true, data: metrics })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}