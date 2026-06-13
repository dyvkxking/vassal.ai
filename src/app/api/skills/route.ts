import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transformSkill } from '@/lib/db/transformers'
import { CreateSkillSchema } from '@/lib/schemas/skills'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

function validateJsonSchema(schema: unknown): boolean {
  if (typeof schema !== 'object' || schema === null) return false
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

  // Build Prisma where clause
  const where: Record<string, unknown> = {}

  if (category) {
    where.category = category
  }

  if (status) {
    where.status = status
  }

  if (minUsage) {
    where.usageCount = { gte: BigInt(parseInt(minUsage, 10)) }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  try {
    // Get total count
    const total = await prisma.skill.count({ where })

    // Get paginated skills
    const skills = await prisma.skill.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json(
      { data: skills.map(transformSkill), total, page, pageSize, totalPages },
      {
        status: 200,
        headers: {
          'X-Total-Count': String(total),
          'X-Page': String(page),
          'X-Per-Page': String(pageSize),
        },
      }
    )
  } catch (error) {
    console.error('Failed to fetch skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
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

    // Check role
    const role = request.headers.get('x-role')
    if (role !== 'creator') {
      return NextResponse.json(
        { error: 'Creator role required to publish skills', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Validate inputSchema is a valid JSON Schema object
    if (!validateJsonSchema(data.spec.inputSchema)) {
      return NextResponse.json(
        { error: 'inputSchema must be a valid JSON Schema object', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Validate outputSchema is a valid JSON Schema object
    if (!validateJsonSchema(data.spec.outputSchema)) {
      return NextResponse.json(
        { error: 'outputSchema must be a valid JSON Schema object', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Create new skill
    const newSkill = await prisma.skill.create({
      data: {
        author: data.author,
        name: data.name,
        description: data.description,
        category: data.category,
        version: '1.0.0',
        pricePerInvocation: data.pricePerInvocation,
        usageCount: BigInt(0),
        avgRating: 0,
        status: 'draft',
        inputSchema: data.spec.inputSchema as object,
        outputSchema: data.spec.outputSchema as object,
        parameters: data.spec.parameters as object,
        examples: data.spec.examples as object,
      },
    })

    return NextResponse.json({ data: transformSkill(newSkill) }, { status: 201 })
  } catch (error) {
    console.error('Failed to create skill:', error)
    return NextResponse.json(
      { error: 'Failed to create skill', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
