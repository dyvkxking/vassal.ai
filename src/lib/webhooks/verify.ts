import crypto from 'crypto'

/**
 * Verify HMAC-SHA256 webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

/**
 * Verify webhook timestamp to prevent replay attacks
 * @param timestamp - Unix timestamp in milliseconds
 * @param toleranceMs - Maximum allowed age in milliseconds (default: 5 minutes)
 */
export function verifyWebhookTimestamp(
  timestamp: number,
  toleranceMs: number = 5 * 60 * 1000
): boolean {
  const now = Date.now()
  const age = Math.abs(now - timestamp)
  return age <= toleranceMs
}

/**
 * Parse and validate webhook event
 */
export interface WebhookEvent<T = unknown> {
  eventId: string
  eventType: string
  timestamp: number
  data: T
}

export interface ParseResult<T = unknown> {
  success: boolean
  event?: WebhookEvent<T>
  error?: string
}

export function parseWebhookEvent<T = unknown>(
  eventType: string,
  payload: unknown
): ParseResult<T> {
  // Validate payload structure
  if (!payload || typeof payload !== 'object') {
    return { success: false, error: 'Invalid payload: must be an object' }
  }

  const p = payload as Record<string, unknown>

  // Check required fields
  if (!p.eventId || typeof p.eventId !== 'string') {
    return { success: false, error: 'Invalid payload: missing or invalid eventId' }
  }

  if (!p.eventType || typeof p.eventType !== 'string') {
    return { success: false, error: 'Invalid payload: missing or invalid eventType' }
  }

  if (typeof p.timestamp !== 'number') {
    return { success: false, error: 'Invalid payload: missing or invalid timestamp' }
  }

  // Verify event type matches
  if (p.eventType !== eventType) {
    return {
      success: false,
      error: `Event type mismatch: expected ${eventType}, got ${p.eventType}`
    }
  }

  return {
    success: true,
    event: {
      eventId: p.eventId as string,
      eventType: p.eventType as string,
      timestamp: p.timestamp as number,
      data: p.data as T
    }
  }
}

/**
 * Extract signature from headers
 */
export function extractSignature(
  headers: Headers,
  signatureHeader: string = 'x-webhook-signature'
): string | null {
  const signature = headers.get(signatureHeader)
  if (!signature) return null

  // Support both raw signature and prefixed (e.g., "sha256=...")
  if (signature.startsWith('sha256=')) {
    return signature.slice(7)
  }

  return signature
}

/**
 * Extract timestamp from headers
 */
export function extractTimestamp(
  headers: Headers,
  timestampHeader: string = 'x-webhook-timestamp'
): number | null {
  const timestamp = headers.get(timestampHeader)
  if (!timestamp) return null

  const parsed = parseInt(timestamp, 10)
  if (isNaN(parsed)) return null

  return parsed
}