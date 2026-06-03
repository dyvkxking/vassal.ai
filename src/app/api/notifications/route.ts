import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockNotifications = [
      { id: 'notif-001', type: 'session_start', message: 'Session started with Alpha Miner', read: false, timestamp: '2026-06-04T08:00:00Z' },
      { id: 'notif-002', type: 'session_end', message: 'Session completed successfully', read: true, timestamp: '2026-06-03T18:30:00Z' },
      { id: 'notif-003', type: 'reward_earned', message: 'You earned 25.50 VASSAL', read: false, timestamp: '2026-06-03T12:00:00Z' },
    ]
    return NextResponse.json({ success: true, data: mockNotifications })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, data: { updated: true } })
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 })
  }
}