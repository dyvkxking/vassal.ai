import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PROVIDER_NODES } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ success: true, data: MOCK_PROVIDER_NODES })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}