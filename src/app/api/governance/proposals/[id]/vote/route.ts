import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { choice, reason } = body

    if (!choice || !['for', 'against', 'abstain'].includes(choice)) {
      return NextResponse.json({ success: false, error: 'Invalid vote choice' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        proposalId: id,
        choice,
        reason,
        timestamp: new Date().toISOString(),
        votingPower: 1000000,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 })
  }
}