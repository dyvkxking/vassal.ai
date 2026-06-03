import { NextRequest, NextResponse } from 'next/server'
import { getProposalById } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const proposal = getProposalById(id)
    if (!proposal) {
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: proposal })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}