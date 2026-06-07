import { z } from 'zod'
import { NOTIFICATION_TYPES } from '@/constants'

// ============ NOTIFICATION ============

export const NotificationTypeSchema = z.enum([
  NOTIFICATION_TYPES.SESSION_START,
  NOTIFICATION_TYPES.SESSION_END,
  NOTIFICATION_TYPES.SESSION_SLA_WARNING,
  NOTIFICATION_TYPES.SESSION_TERMINATED,
  NOTIFICATION_TYPES.SLASHED,
  NOTIFICATION_TYPES.PROPOSAL_NEW,
  NOTIFICATION_TYPES.PROPOSAL_VOTE_REMINDER,
  NOTIFICATION_TYPES.PROPOSAL_RESULTS,
  NOTIFICATION_TYPES.PAYOUT_READY,
  NOTIFICATION_TYPES.REWARD_EARNED,
  NOTIFICATION_TYPES.SKILL_PAYMENT,
  NOTIFICATION_TYPES.SYSTEM_UPGRADE,
])

export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  read: z.boolean(),
  timestamp: z.number().int().positive(),
  link: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const MarkReadSchema = z.object({
  notificationId: z.string().min(1),
})

export const MarkAllReadSchema = z.object({
  // Empty object - marks all as read
})

export type Notification = z.infer<typeof NotificationSchema>
export type MarkRead = z.infer<typeof MarkReadSchema>
export type NotificationType = z.infer<typeof NotificationTypeSchema>