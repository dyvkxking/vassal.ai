import { NextRequest, NextResponse } from 'next/server'
import { getAgentById } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const agent = getAgentById(id)
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: agent })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    return NextResponse.json({ success: true, data: { id, archived: true } })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}