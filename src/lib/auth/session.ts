// Session management with JWT tokens
import * as jose from 'jose'
import type { UserRole } from '@/types'

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
)
const JWT_ISSUER = 'vassal.ai'
const JWT_AUDIENCE = 'vassal.ai-client'

// Session token types
export interface SessionPayload {
  address: string
  role: UserRole
  createdAt: number
  expiresAt: number
  sessionId: string
}

// Default session expiry (1 hour)
const DEFAULT_EXPIRY_SECONDS = 3600
// Extended expiry for "remember me" (7 days)
const EXTENDED_EXPIRY_SECONDS = 7 * 24 * 3600

/**
 * Create a JWT session token
 * @param address - The wallet address
 * @param role - The user's role
 * @param rememberMe - If true, use extended expiry (7 days)
 * @returns The JWT token string
 */
export async function createSession(
  address: string,
  role: UserRole,
  rememberMe = false
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const expirySeconds = rememberMe ? EXTENDED_EXPIRY_SECONDS : DEFAULT_EXPIRY_SECONDS
  const expiresAt = now + expirySeconds

  const sessionId = generateSessionId()

  const jwt = await new jose.SignJWT({
    address: address.toLowerCase(),
    role,
    sessionId,
    createdAt: now,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET)

  return jwt
}

/**
 * Verify and decode a JWT session token
 * @param token - The JWT token to verify
 * @returns The decoded session payload, or null if invalid
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    // Check if token is expired (jwtVerify handles this, but double-check)
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    // Validate required fields
    if (!payload.address || !payload.role || !payload.sessionId) {
      return null
    }

    return {
      address: payload.address as string,
      role: payload.role as UserRole,
      createdAt: payload.iat || 0,
      expiresAt: payload.exp || 0,
      sessionId: payload.sessionId as string,
    }
  } catch {
    return null
  }
}

/**
 * Refresh a session token (create new token with same address/role)
 * @param token - The current token
 * @returns New token if valid, null otherwise
 */
export async function refreshSession(token: string): Promise<string | null> {
  const session = await verifySession(token)
  if (!session) {
    return null
  }

  // Create new session with same address/role but new expiry
  return createSession(session.address, session.role, false)
}

/**
 * Revoke a session token (invalidate)
 * Note: For full revocation, store revoked session IDs in Redis/database
 * This function is a placeholder that returns true - actual revocation
 * requires checking against a revoked tokens list
 * @param token - The token to revoke
 * @returns True if token was valid (can be revoked), false otherwise
 */
export async function revokeSession(token: string): Promise<boolean> {
  const session = await verifySession(token)
  return session !== null
}

/**
 * Extract token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns The token string, or null if not found
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null
  }

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return null
}

/**
 * Extract token from cookies
 * @param cookies - The cookies string (format: "key1=val1; key2=val2")
 * @param cookieName - The name of the cookie to extract
 * @returns The token value, or null if not found
 */
export function extractTokenFromCookie(cookies: string | null, cookieName = 'session'): string | null {
  if (!cookies) {
    return null
  }

  const cookiePairs = cookies.split(';').map((c) => c.trim())
  const sessionCookie = cookiePairs.find((pair) => pair.startsWith(`${cookieName}=`))

  if (!sessionCookie) {
    return null
  }

  return sessionCookie.slice(cookieName.length + 1)
}

/**
 * Generate a unique session ID
 * @returns A random session ID
 */
function generateSessionId(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Get cookie options for session cookie
 * @param rememberMe - Whether to use extended expiry
 * @returns Cookie options object
 */
export function getSessionCookieOptions(rememberMe = false) {
  const maxAge = rememberMe ? EXTENDED_EXPIRY_SECONDS : DEFAULT_EXPIRY_SECONDS

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  }
}

/**
 * Parse session cookie header value
 * @param token - The session token
 * @param rememberMe - Whether to use extended expiry
 * @returns Formatted cookie string
 */
export function formatSessionCookie(token: string, rememberMe = false): string {
  const options = getSessionCookieOptions(rememberMe)
  const optionStr = Object.entries(options)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : ''
      }
      return `${key}=${value}`
    })
    .filter(Boolean)
    .join('; ')

  return `session=${token}; ${optionStr}`
}