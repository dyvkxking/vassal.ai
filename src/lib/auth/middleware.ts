// Auth middleware for protected routes
import { NextRequest, NextResponse } from 'next/server'
import type { UserRole } from '@/types'
import {
  verifySession,
  extractTokenFromHeader,
  extractTokenFromCookie,
} from './session'
import { hasRole, RoleHierarchy } from './roles'
import { verifyLoginMessage } from './signature'

// Extended session type with request context
export interface AuthenticatedRequest {
  address: string
  role: UserRole
  sessionId: string
  token: string
}

/**
 * Extract wallet address from request headers
 * Supports multiple header formats for flexibility
 * @param request - The Next.js request
 * @returns The wallet address or null
 */
export function getWalletFromRequest(request: NextRequest): string | null {
  // Check x-wallet-address header
  const headerAddress = request.headers.get('x-wallet-address')
  if (headerAddress) {
    return headerAddress
  }

  // Check Authorization header for Bearer token
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    const token = extractTokenFromHeader(authHeader)
    if (token) {
      // Synchronous verification for middleware - we need to handle async
      return null // Will be resolved in requireAuth
    }
  }

  // Check cookie for session token
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const token = extractTokenFromCookie(cookieHeader)
    if (token) {
      return null // Will be resolved in requireAuth
    }
  }

  return null
}

/**
 * Verify request payload signature
 * Used for authenticated API calls that include a signature
 * @param request - The Next.js request
 * @returns True if signature is valid
 */
export async function verifyRequestSignature(request: NextRequest): Promise<boolean> {
  const signature = request.headers.get('x-signature')
  const message = request.headers.get('x-signature-message')
  const address = request.headers.get('x-wallet-address')

  if (!signature || !message || !address) {
    return false
  }

  return verifyLoginMessage(message, address, signature)
}

/**
 * Middleware function to require authentication
 * @param allowedRoles - Optional array of roles that are allowed
 * @returns A middleware function that checks authentication
 */
export function requireAuth(allowedRoles?: UserRole[]) {
  return async (request: NextRequest): Promise<NextResponse | AuthenticatedRequest> => {
    // Try to get token from Authorization header first, then cookies
    let token = extractTokenFromHeader(request.headers.get('authorization'))

    if (!token) {
      const cookieHeader = request.headers.get('cookie')
      token = extractTokenFromCookie(cookieHeader)
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'unauthorized' },
        { status: 401 }
      )
    }

    // Verify the session
    const session = await verifySession(token)

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session', code: 'unauthorized' },
        { status: 401 }
      )
    }

    // Check role if roles are specified
    if (allowedRoles && allowedRoles.length > 0) {
      if (!hasRole(session.role, allowedRoles)) {
        return NextResponse.json(
          { error: 'Insufficient permissions', code: 'forbidden' },
          { status: 403 }
        )
      }
    }

    // Return authenticated request context
    return {
      address: session.address,
      role: session.role,
      sessionId: session.sessionId,
      token,
    } as AuthenticatedRequest
  }
}

/**
 * Create a response with authentication error
 * @param code - Error code
 * @param message - Error message
 * @param status - HTTP status code
 * @returns NextResponse with error
 */
export function authError(
  code: 'unauthorized' | 'forbidden' | 'not_found',
  message: string,
  status: number
): NextResponse {
  return NextResponse.json({ error: message, code }, { status })
}

/**
 * Get auth context from request (async version for route handlers)
 * @param request - The Next.js request
 * @returns Auth context or null if not authenticated
 */
export async function getAuthContext(request: NextRequest): Promise<AuthenticatedRequest | null> {
  let token = extractTokenFromHeader(request.headers.get('authorization'))

  if (!token) {
    const cookieHeader = request.headers.get('cookie')
    token = extractTokenFromCookie(cookieHeader)
  }

  if (!token) {
    return null
  }

  const session = await verifySession(token)
  if (!session) {
    return null
  }

  return {
    address: session.address,
    role: session.role,
    sessionId: session.sessionId,
    token,
  }
}

/**
 * Create middleware wrapper for route handlers
 * @param handler - The route handler function
 * @param allowedRoles - Optional allowed roles
 * @returns Wrapped handler with auth check
 */
export function withAuth<T>(
  handler: (req: NextRequest, context: AuthenticatedRequest) => Promise<NextResponse>,
  allowedRoles?: UserRole[]
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await requireAuth(allowedRoles)(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    return handler(request, authResult as AuthenticatedRequest)
  }
}