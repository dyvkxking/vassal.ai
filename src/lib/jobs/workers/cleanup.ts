// Cleanup worker - handles archival and cleanup of old data

import type { Job, JobResult } from '../types'
import { MOCK_SESSIONS } from '@/lib/mock-data'

// Cleanup thresholds
const SESSION_ARCHIVE_DAYS = 30
const NONCE_EXPIRY_HOURS = 1
const WEBHOOK_RECORD_DAYS = 7
const FAILED_JOB_RECORD_DAYS = 30
const OLD_NOTIFICATION_DAYS = 90
const VERY_OLD_NOTIFICATION_DAYS = 365

/**
 * Archive sessions older than 30 days
 * Moves to cold storage or deletes, keeping aggregate stats
 */
export async function archiveOldSessions(): Promise<{
  archived: number
  deleted: number
}> {
  const cutoffTime = Date.now() - SESSION_ARCHIVE_DAYS * 86400000
  let archived = 0
  let deleted = 0

  // In a real implementation:
  // 1. Query sessions where endTime < cutoffTime AND status = 'completed'
  // 2. Move to cold storage table or delete
  // 3. Keep aggregate statistics
  // 4. Update session count totals

  for (const session of MOCK_SESSIONS) {
    if (session.endTime && session.endTime < cutoffTime) {
      // Mock: just log the action
      archived++
    }
  }

  console.log(`[Cleanup] Archived ${archived} old sessions`)

  return { archived, deleted }
}

/**
 * Delete expired nonce records
 */
export async function cleanupExpiredNonces(): Promise<{
  deleted: number
}> {
  const cutoffTime = Date.now() - NONCE_EXPIRY_HOURS * 3600000
  let deleted = 0

  // In a real implementation:
  // 1. Query nonce records where createdAt < cutoffTime OR used = true AND createdAt < cutoffTime
  // 2. Delete expired records
  // 3. Log cleanup stats

  console.log(`[Cleanup] Deleted ${deleted} expired nonce records`)

  return { deleted }
}

/**
 * Delete old webhook idempotency records (> 7 days)
 */
export async function cleanupOldWebhookRecords(): Promise<{
  deleted: number
}> {
  const cutoffTime = Date.now() - WEBHOOK_RECORD_DAYS * 86400000
  let deleted = 0

  // In a real implementation:
  // 1. Query webhook records where createdAt < cutoffTime
  // 2. Delete old idempotency records
  // 3. Log cleanup stats

  console.log(`[Cleanup] Deleted ${deleted} old webhook records`)

  return { deleted }
}

/**
 * Delete old failed job records (> 30 days)
 */
export async function cleanupOldFailedJobs(): Promise<{
  deleted: number
}> {
  const cutoffTime = Date.now() - FAILED_JOB_RECORD_DAYS * 86400000
  let deleted = 0

  // In a real implementation:
  // 1. Query job records where status = 'failed' AND completedAt < cutoffTime
  // 2. Delete old failed job records
  // 3. Log cleanup stats

  console.log(`[Cleanup] Deleted ${deleted} old failed job records`)

  return { deleted }
}

/**
 * Mark read notifications > 90 days as archivable
 */
export async function markOldNotificationsArchivable(): Promise<{
  marked: number
}> {
  const cutoffTime = Date.now() - OLD_NOTIFICATION_DAYS * 86400000
  let marked = 0

  // In a real implementation:
  // 1. Query notifications where read = true AND timestamp < cutoffTime
  // 2. Mark as archivable
  // 3. Log stats

  console.log(`[Cleanup] Marked ${marked} old notifications as archivable`)

  return { marked }
}

/**
 * Delete read notifications > 1 year old
 */
export async function deleteVeryOldNotifications(): Promise<{
  deleted: number
}> {
  const cutoffTime = Date.now() - VERY_OLD_NOTIFICATION_DAYS * 86400000
  let deleted = 0

  // In a real implementation:
  // 1. Query notifications where read = true AND timestamp < cutoffTime AND archivable = true
  // 2. Delete permanently
  // 3. Log stats

  console.log(`[Cleanup] Deleted ${deleted} very old notifications`)

  return { deleted }
}

/**
 * Run all cleanup tasks
 */
export async function runAllCleanupTasks(): Promise<{
  sessionsArchived: number
  noncesDeleted: number
  webhooksDeleted: number
  failedJobsDeleted: number
  notificationsMarked: number
  notificationsDeleted: number
}> {
  const [sessions, nonces, webhooks, failedJobs, notificationsMarked, notificationsDeleted] =
    await Promise.all([
      archiveOldSessions(),
      cleanupExpiredNonces(),
      cleanupOldWebhookRecords(),
      cleanupOldFailedJobs(),
      markOldNotificationsArchivable(),
      deleteVeryOldNotifications(),
    ])

  return {
    sessionsArchived: sessions.archived,
    noncesDeleted: nonces.deleted,
    webhooksDeleted: webhooks.deleted,
    failedJobsDeleted: failedJobs.deleted,
    notificationsMarked: notificationsMarked.marked,
    notificationsDeleted: notificationsDeleted.deleted,
  }
}

/**
 * Job processor for session cleanup jobs
 */
export async function processCleanupJob(
  job: Job<{ olderThanDays?: number }>
): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const olderThanDays = job.data.olderThanDays || SESSION_ARCHIVE_DAYS

    // For specific olderThanDays, we adjust the archive cutoff
    if (olderThanDays !== SESSION_ARCHIVE_DAYS) {
      const cutoffTime = Date.now() - olderThanDays * 86400000
      let archived = 0

      for (const session of MOCK_SESSIONS) {
        if (session.endTime && session.endTime < cutoffTime) {
          archived++
        }
      }

      return {
        success: true,
        jobId: job.id,
        type: 'SessionCleanupJob',
        data: job.data,
        result: { archived, deleted: 0, olderThanDays },
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
        retries: job.retries,
      }
    }

    // Run standard cleanup
    const result = await runAllCleanupTasks()

    return {
      success: true,
      jobId: job.id,
      type: 'SessionCleanupJob',
      data: job.data,
      result,
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  } catch (error) {
    return {
      success: false,
      jobId: job.id,
      type: 'SessionCleanupJob',
      data: job.data,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
      timestamp: Date.now(),
      retries: job.retries,
    }
  }
}