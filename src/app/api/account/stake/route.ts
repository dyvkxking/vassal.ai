import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mockStake = {
      positions: [
        {
          id: 'stake-001',
          amount: 5000000,
          token: 'VASSAL',
          lockedUntil: '2027-06-01T00:00:00Z',
          tier: 'genesis',
        },
      ],
      totalStaked: 5000000,
      availableRewards: 1250.75,
    }
    return NextResponse.json({ success: true, data: mockStake })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, data: body }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 })
  }
}