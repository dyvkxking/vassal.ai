import { NextRequest, NextResponse } from 'next/server'
import { getSkillById } from '@/lib/mock-data'
import { UpdateSkillSchema } from '@/lib/schemas/skills'
import type { Skill } from '@/types'

// In-memory store reference (shared with parent route)
let skillsStore: Skill[] = []

function getStore(): Skill[] {
  if (skillsStore.length === 0) {
    // Lazy initialization to avoid circular import issues
    const { MOCK_SKILLS } = require('@/lib/mock-data')
    skillsStore = [...MOCK_SKILLS]
  }
  return skillsStore
}

function findSkillById(id: string): Skill | undefined {
  return getStore().find((s) => s.id === id)
}

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/skills/[id] — Get skill by ID
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const skill = findSkillById(id)

  if (!skill) {
    return NextResponse.json(
      { error: 'Skill not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: skill }, { status: 200 })
}

// PATCH /api/skills/[id] — Update skill (author only)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const skill = findSkillById(id)

  if (!skill) {
    return NextResponse.json(
      { error: 'Skill not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Check authentication
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  // Verify ownership
  if (skill.author !== walletAddress) {
    return NextResponse.json(
      { error: 'Only the author can update this skill', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()

    // Validate update data
    const result = UpdateSkillSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    // Apply update
    const store = getStore()
    const index = store.findIndex((s) => s.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Skill not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const updatedSkill: Skill = {
      ...skill,
      ...result.data,
      updatedAt: Date.now(),
    }

    store[index] = updatedSkill

    return NextResponse.json({ data: updatedSkill }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}

// DELETE /api/skills/[id] — Soft delete (author only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  const skill = findSkillById(id)

  if (!skill) {
    return NextResponse.json(
      { error: 'Skill not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  // Check authentication
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  // Verify ownership
  if (skill.author !== walletAddress) {
    return NextResponse.json(
      { error: 'Only the author can delete this skill', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  // Soft delete by setting status to deprecated
  const store = getStore()
  const index = store.findIndex((s) => s.id === id)
  if (index === -1) {
    return NextResponse.json(
      { error: 'Skill not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  const deletedSkill: Skill = {
    ...skill,
    status: 'deprecated',
    updatedAt: Date.now(),
  }

  store[index] = deletedSkill

  return NextResponse.json(
    { data: { id: deletedSkill.id, status: 'deprecated' }, message: 'Skill deprecated successfully' },
    { status: 200 }
  )
}