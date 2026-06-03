import { NextRequest, NextResponse } from 'next/server'
import { MOCK_EARNINGS_BREAKDOWN } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Return mock earnings breakdown for provider
    return NextResponse.json({
      success: true,
      data: {
        providerId: id,
        ...MOCK_EARNINGS_BREAKDOWN,
        total: MOCK_EARNINGS_BREAKDOWN.baseEarnings +
               MOCK_EARNINGS_BREAKDOWN.slaComplianceBonus +
               MOCK_EARNINGS_BREAKDOWN.genesisProgramBonus +
               MOCK_EARNINGS_BREAKDOWN.skillInvocationEarnings,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}