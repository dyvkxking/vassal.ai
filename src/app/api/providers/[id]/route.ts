import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PROVIDER_NODES } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const provider = MOCK_PROVIDER_NODES.find(p => p.id === id)
    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: provider })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    return NextResponse.json({ success: true, data: { id, ...body } })
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 })
  }
}