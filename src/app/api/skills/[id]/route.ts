import { NextRequest, NextResponse } from 'next/server'
import { getSkillById } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const skill = getSkillById(id)
    if (!skill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: skill })
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