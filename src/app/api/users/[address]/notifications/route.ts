import { NextRequest, NextResponse } from 'next/server'
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'
import type { Notification } from '@/types'

interface RouteParams {
  params: Promise<{ address: string }>
}

// In-memory notification store (address -> notifications)
const notificationStore = new Map<string, Notification[]>()

// Initialize with mock notifications (assigning to mock address)
// MOCK_NOTIFICATIONS are general system notifications; for user-specific
// notifications, we use the store. The first mock notification is assigned
// to the mock user address for demo purposes.
notificationStore.set('0x1234...abcd', [
  { ...MOCK_NOTIFICATIONS[0], id: 'notif-001' },
  { ...MOCK_NOTIFICATIONS[1], id: 'notif-002' },
])

// GET /api/users/[address]/notifications — Get user's notifications (authenticated)
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { address } = await params
  const { searchParams } = new URL(request.url)

  // Authentication check — only address owner can view their notifications
  const walletAddress = request.headers.get('x-wallet-address')
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  if (walletAddress.toLowerCase() !== address.toLowerCase()) {
    return NextResponse.json(
      { error: 'You can only view your own notifications', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get('pageSize') || String(PAGE_SIZE_DEFAULT), 10))
  )

  // Get user notifications from store
  const userNotifications = notificationStore.get(address.toLowerCase()) || []

  // Filter by read status if provided
  const readParam = searchParams.get('read')
  let filtered = userNotifications
  if (readParam !== null) {
    const read = readParam === 'true'
    filtered = userNotifications.filter((n) => n.read === read)
  }

  // Sort by timestamp descending (most recent first)
  filtered.sort((a, b) => b.timestamp - a.timestamp)

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize
  const paginated = filtered.slice(offset, offset + pageSize)

  return NextResponse.json(
    {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages,
      unreadCount: userNotifications.filter((n) => !n.read).length,
      address,
    },
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