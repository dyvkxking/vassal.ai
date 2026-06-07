import { NextRequest, NextResponse } from 'next/server'
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

// GET /api/skills/[id]/usage — Get usage stats for a skill
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

  // Return usage statistics
  const usageStats = {
    skillId: skill.id,
    skillName: skill.name,
    usageCount: skill.usageCount,
    avgRating: skill.avgRating,
    pricePerInvocation: skill.pricePerInvocation,
    status: skill.status,
    // Mock additional usage metrics
    totalInvocations: skill.usageCount,
    successfulInvocations: Math.floor(skill.usageCount * 0.97), // ~97% success rate
    failedInvocations: Math.floor(skill.usageCount * 0.03), // ~3% failure rate
    revenue: skill.usageCount * skill.pricePerInvocation,
    lastUsed: Date.now() - Math.floor(Math.random() * 86400000 * 7), // Within last 7 days
  }

  return NextResponse.json({ data: usageStats }, { status: 200 })
}