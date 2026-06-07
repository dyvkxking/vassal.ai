import { z } from 'zod'
import { SESSION_STATUS, SLA_BREACH_TYPES } from '@/constants'
import { SLAParamsSchema } from './agents'

// ============ SESSION ============

export const LatencyMetricsSchema = z.object({
  avgLatencyMs: z.number().nonnegative(),
  p50LatencyMs: z.number().nonnegative(),
  p95LatencyMs: z.number().nonnegative(),
  p99LatencyMs: z.number().nonnegative(),
  breaches: z.number().int().nonnegative(),
})

export const SlashEventSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  type: z.enum([SLA_BREACH_TYPES.LATENCY, SLA_BREACH_TYPES.TPM, SLA_BREACH_TYPES.UPTIME, SLA_BREACH_TYPES.HEARTBEAT]),
  amount: z.number().nonnegative(),
  timestamp: z.number().int().positive(),
  reason: z.string(),
})

export const LearningSignalSchema = z.object({
  taskDescription: z.string(),
  agentResponse: z.string(),
  clientRating: z.number().min(0).max(5),
  taskCompletionStatus: z.enum(['completed', 'partial', 'failed']),
  latencyMetrics: LatencyMetricsSchema,
  tpmAchieved: z.number().nonnegative(),
  spotCheckPassed: z.boolean().optional(),
  approvedByBuilder: z.boolean().optional(),
  appliedToMemory: z.boolean().optional(),
})

export const SessionStatusSchema = z.enum([
  SESSION_STATUS.PENDING,
  SESSION_STATUS.ACTIVE,
  SESSION_STATUS.COMPLETED,
  SESSION_STATUS.FAILED,
  SESSION_STATUS.CANCELLED,
  SESSION_STATUS.DISPUTED,
])

export const SessionSchema = z.object({
  id: z.string(),
  client: z.string(),
  agentId: z.string(),
  providerNode: z.string(),
  status: SessionStatusSchema,
  slaParams: SLAParamsSchema,
  startTime: z.number().int().positive(),
  endTime: z.number().int().positive().optional(),
  tpmUsed: z.number().nonnegative(),
  totalCost: z.number().nonnegative(),
  latencyMetrics: LatencyMetricsSchema,
  rating: z.number().min(0).max(5).optional(),
  feedback: z.string().optional(),
  slashEvents: z.array(SlashEventSchema),
  learningSignal: LearningSignalSchema.optional(),
})

export const CreateSessionSchema = z.object({
  client: z.string().min(1),
  agentId: z.string().min(1),
  providerNode: z.string().min(1),
})

export const UpdateSessionSchema = z.object({
  status: SessionStatusSchema.optional(),
  rating: z.number().min(0).max(5).optional(),
  feedback: z.string().optional(),
})

export type Session = z.infer<typeof SessionSchema>
export type CreateSession = z.infer<typeof CreateSessionSchema>
export type UpdateSession = z.infer<typeof UpdateSessionSchema>
export type LatencyMetrics = z.infer<typeof LatencyMetricsSchema>
export type SlashEvent = z.infer<typeof SlashEventSchema>
export type SessionStatus = z.infer<typeof SessionStatusSchema>