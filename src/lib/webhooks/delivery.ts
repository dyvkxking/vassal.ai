import crypto from 'crypto'

// In-memory delivery log (for now)
interface DeliveryLog {
  id: string
  url: string
  payload: unknown
  signature: string
  attempts: number
  maxAttempts: number
  status: 'pending' | 'success' | 'failed' | 'retrying'
  lastAttemptAt?: number
  nextRetryAt?: number
  responseStatus?: number
  responseBody?: string
  error?: string
  createdAt: number
}

const deliveryLogs = new Map<string, DeliveryLog>()

// Exponential backoff delays: 1s, 5s, 30s, 2min, 10min
const RETRY_DELAYS = [1000, 5000, 30000, 120000, 600000]
const MAX_ATTEMPTS = 3

/**
 * Generate HMAC signature for webhook payload
 */
function signPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

/**
 * Deliver webhook with retry
 */
export async function deliverWebhook(
  url: string,
  payload: unknown,
  secret: string
): Promise<{ success: boolean; deliveryId: string }> {
  const deliveryId = crypto.randomUUID()
  const payloadString = JSON.stringify(payload)
  const signature = signPayload(payloadString, secret)

  const log: DeliveryLog = {
    id: deliveryId,
    url,
    payload,
    signature,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    status: 'pending',
    createdAt: Date.now()
  }

  deliveryLogs.set(deliveryId, log)

  // Attempt delivery
  const result = await attemptDelivery(deliveryId)

  return { success: result, deliveryId }
}

/**
 * Attempt to deliver a webhook
 */
async function attemptDelivery(deliveryId: string): Promise<boolean> {
  const log = deliveryLogs.get(deliveryId)
  if (!log) return false

  log.attempts++
  log.lastAttemptAt = Date.now()

  try {
    const response = await fetch(log.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': `sha256=${log.signature}`,
        'X-Webhook-Delivery': log.id,
        'X-Webhook-Timestamp': log.lastAttemptAt.toString()
      },
      body: JSON.stringify(log.payload),
      signal: AbortSignal.timeout(10000) // 10s timeout
    })

    log.responseStatus = response.status
    log.responseBody = await response.text().catch(() => undefined)

    if (response.ok) {
      log.status = 'success'
      return true
    }

    // Non-success response
    log.status = log.attempts < log.maxAttempts ? 'retrying' : 'failed'
    if (log.status === 'retrying') {
      const delayIndex = Math.min(log.attempts - 1, RETRY_DELAYS.length - 1)
      log.nextRetryAt = Date.now() + RETRY_DELAYS[delayIndex]
    }

    return false
  } catch (error) {
    log.error = error instanceof Error ? error.message : 'Unknown error'
    log.status = log.attempts < log.maxAttempts ? 'retrying' : 'failed'

    if (log.status === 'retrying') {
      const delayIndex = Math.min(log.attempts - 1, RETRY_DELAYS.length - 1)
      log.nextRetryAt = Date.now() + RETRY_DELAYS[delayIndex]
    }

    return false
  }
}

/**
 * Retry failed webhook delivery
 */
export async function retryWebhook(deliveryId: string): Promise<boolean> {
  const log = deliveryLogs.get(deliveryId)

  if (!log) return false
  if (log.status === 'success') return true
  if (log.attempts >= log.maxAttempts) return false

  // Check if it's time to retry
  if (log.nextRetryAt && Date.now() < log.nextRetryAt) {
    return false
  }

  return attemptDelivery(deliveryId)
}

/**
 * Get webhook delivery status
 */
export function getWebhookDeliveryStatus(deliveryId: string): DeliveryLog | null {
  return deliveryLogs.get(deliveryId) || null
}

/**
 * Get all pending retries
 */
export function getPendingRetries(): DeliveryLog[] {
  const now = Date.now()
  return Array.from(deliveryLogs.values()).filter(
    (log) => log.status === 'retrying' && log.nextRetryAt && log.nextRetryAt <= now
  )
}

/**
 * Process pending retries (can be called by a cron job)
 */
export async function processRetries(): Promise<void> {
  const pending = getPendingRetries()
  await Promise.all(pending.map((log) => retryWebhook(log.id)))
}

/**
 * Clear old delivery logs (cleanup)
 */
export function clearOldLogs(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): void {
  const cutoff = Date.now() - maxAgeMs
  for (const [id, log] of deliveryLogs.entries()) {
    if (log.createdAt < cutoff) {
      deliveryLogs.delete(id)
    }
  }
}