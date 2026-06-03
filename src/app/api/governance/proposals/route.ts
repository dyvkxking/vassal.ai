import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PROPOSALS } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filtered = MOCK_PROPOSALS
    if (status) {
      filtered = filtered.filter(p => p.status === status)
    }

    const start = (page - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: { page, limit, total: filtered.length },
    })
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