import { NextRequest, NextResponse } from 'next/server'
import { getSkillById, MOCK_SKILLS } from '@/lib/mock-data'
import { SkillSchema, CreateSkillSchema } from '@/lib/schemas/skills'
import { SkillFiltersSchema } from '@/lib/schemas/api'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// In-memory store for skills (mutable copy of MOCK_SKILLS)
let skillsStore = [...MOCK_SKILLS]

function validateJsonSchema(schema: unknown, fieldName: string): boolean {
  if (typeof schema !== 'object' || schema === null) return false
  // Must be a valid JSON Schema object (at minimum an object with optional properties)
  const s = schema as Record<string, unknown>
  if (typeof s.type !== 'undefined' && typeof s.type !== 'string') return false
  if (typeof s.properties !== 'undefined' && typeof s.properties !== 'object') return false
  return true
}

// GET /api/skills — List skills with filtering and pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Parse pagination params
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Parse filter params
  const category = searchParams.get('category') || undefined
  const status = searchParams.get('status') || undefined
  const minUsage = searchParams.get('minUsage')
  const search = searchParams.get('search')?.toLowerCase()

  // Validate filter combination
  const filterResult = SkillFiltersSchema.safeParse({
    category,
    status,
    minUsage: minUsage ? parseInt(minUsage, 10) : undefined,
    search,
  })
  if (!filterResult.success) {
    return NextResponse.json(
      { error: 'Invalid filter parameters', code: 'VALIDATION_ERROR', details: filterResult.error.flatten() },
      { status: 400 }
    )
  }

  // Apply filters
  let filtered = skillsStore

  if (category) {
    filtered = filtered.filter((s) => s.category === category)
  }

  if (status) {
    filtered = filtered.filter((s) => s.status === status)
  }

  if (minUsage) {
    const minUsageNum = parseInt(minUsage, 10)
    filtered = filtered.filter((s) => s.usageCount >= minUsageNum)
  }

  if (search) {
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.description.toLowerCase().includes(search)
    )
  }

  // Sort by createdAt descending
  filtered = filtered.sort((a, b) => b.createdAt - a.createdAt)

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = filtered.slice(offset, offset + pageSize)

  // Validate response data
  const validated = paginated.map((skill) => {
    const result = SkillSchema.safeParse(skill)
    if (!result.success) return null
    return result.data
  }).filter(Boolean)

  return NextResponse.json(
    { data: validated, total, page, pageSize, totalPages },
    {
      status: 200,
      headers: {
        'X-Total-Count': String(total),
        'X-Page': String(page),
        'X-Per-Page': String(pageSize),
      },
    }
  )
}

// POST /api/skills — Publish a new skill (authenticated, creator role)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = CreateSkillSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Check authentication
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Verify author matches authenticated wallet
    if (data.author !== walletAddress) {
      return NextResponse.json(
        { error: 'Author address must match authenticated wallet', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Check role (creator role required)
    const role = request.headers.get('x-role')
    if (role !== 'creator') {
      return NextResponse.json(
        { error: 'Creator role required to publish skills', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Validate inputSchema is a valid JSON Schema object
    if (!validateJsonSchema(data.spec.inputSchema, 'inputSchema')) {
      return NextResponse.json(
        { error: 'inputSchema must be a valid JSON Schema object', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Validate outputSchema is a valid JSON Schema object
    if (!validateJsonSchema(data.spec.outputSchema, 'outputSchema')) {
      return NextResponse.json(
        { error: 'outputSchema must be a valid JSON Schema object', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Validate parameters array items have required fields
    for (const param of data.spec.parameters) {
      if (!param.name || typeof param.name !== 'string') {
        return NextResponse.json(
          { error: 'Each parameter must have a name field', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
      if (!param.type || typeof param.type !== 'string') {
        return NextResponse.json(
          { error: 'Each parameter must have a type field', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
      if (typeof param.required !== 'boolean') {
        return NextResponse.json(
          { error: 'Each parameter must have a required boolean field', code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
    }

    // Create new skill
    const newSkill = {
      ...data,
      id: `skill-${Date.now()}`,
      usageCount: 0,
      avgRating: 0,
      status: 'draft' as const,
      version: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    // Validate the created skill
    const skillResult = SkillSchema.safeParse(newSkill)
    if (!skillResult.success) {
      return NextResponse.json(
        { error: 'Failed to create skill', code: 'INTERNAL_ERROR', details: skillResult.error.flatten() },
        { status: 500 }
      )
    }

    // Add to store
    skillsStore.push(skillResult.data)

    return NextResponse.json({ data: skillResult.data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }
}