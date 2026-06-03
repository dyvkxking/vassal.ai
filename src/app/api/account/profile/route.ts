import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockProfile = {
      id: 'user-001',
      address: '0x1234...abcd',
      name: 'Demo User',
      email: 'demo@vassal.ai',
      avatar: null,
      createdAt: '2024-01-15T10:00:00Z',
    }
    return NextResponse.json({ success: true, data: mockProfile })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, data: body })
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 })
  }
}