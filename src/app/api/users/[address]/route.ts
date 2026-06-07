import { NextRequest, NextResponse } from 'next/server'
import { MOCK_USER_PROFILE } from '@/lib/mock-data'
import { UserProfileSchema, UpdateProfileSchema } from '@/lib/schemas/users'

interface RouteParams {
  params: Promise<{ address: string }>
}

// In-memory profile store (address -> profile)
const profileStore = new Map<string, ReturnType<typeof UserProfileSchema.parse>>()

// Initialize with mock profile
profileStore.set(MOCK_USER_PROFILE.address, MOCK_USER_PROFILE)

// GET /api/users/[address] — Get public user profile
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { address } = await params

  const profile = profileStore.get(address)

  if (!profile) {
    return NextResponse.json(
      { error: 'User not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: profile }, { status: 200 })
}

// PATCH /api/users/[address] — Update own profile (authenticated)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { address } = await params

  // Authentication check
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  // Only address owner can update their profile
  if (walletAddress.toLowerCase() !== address.toLowerCase()) {
    return NextResponse.json(
      { error: 'You can only update your own profile', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  // Get current profile (create default if not exists)
  let profile = profileStore.get(address)
  if (!profile) {
    profile = {
      address,
      displayName: undefined,
      avatarUrl: undefined,
      bio: undefined,
      roles: [],
      stats: {
        totalSessionsAsProvider: 0,
        totalSessionsAsClient: 0,
        agentsCreated: 0,
        skillsPublished: 0,
        proposalsVoted: 0,
      },
      isGenesisParticipant: false,
      joinedAt: Date.now(),
    }
  }

  // Parse and validate request body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }

  const result = UpdateProfileSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', code: 'VALIDATION_ERROR', details: result.error.flatten() },
      { status: 400 }
    )
  }

  // Apply updates
  const updated = {
    ...profile,
    ...result.data,
  }

  // Validate final shape
  const finalResult = UserProfileSchema.safeParse(updated)
  if (!finalResult.success) {
    return NextResponse.json(
      { error: 'Failed to update profile', code: 'INTERNAL_ERROR', details: finalResult.error.flatten() },
      { status: 500 }
    )
  }

  profileStore.set(address, finalResult.data)

  return NextResponse.json({ data: finalResult.data }, { status: 200 })
}