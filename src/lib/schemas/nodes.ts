import { z } from 'zod'

// ============ PROVIDER ============

export const NodeStatusSchema = z.enum(['online', 'offline', 'warning', 'maintenance', 'draining'])

export const HardwareSchema = z.object({
  cpuCores: z.number().int().positive(),
  gpuModel: z.string().optional(),
  gpuMemoryGb: z.number().positive().optional(),
  ramGb: z.number().positive(),
  diskGb: z.number().positive(),
  bandwidthMbps: z.number().positive(),
})

export const HeartbeatSchema = z.object({
  timestamp: z.number().int().positive(),
  loadMetrics: z.object({
    cpuUsagePercent: z.number().min(0).max(100),
    memoryUsagePercent: z.number().min(0).max(100),
    diskUsagePercent: z.number().min(0).max(100),
    networkInBps: z.number().nonnegative(),
    networkOutBps: z.number().nonnegative(),
  }),
})

export const ProviderNodeSchema = z.object({
  id: z.string(),
  operator: z.string(),
  status: NodeStatusSchema,
  stakeAmount: z.number().nonnegative(),
  lockedStake: z.number().nonnegative(),
  availableStake: z.number().nonnegative(),
  hardware: HardwareSchema,
  location: z.string(),
  totalSessions: z.number().int().nonnegative(),
  avgUptime: z.number().min(0).max(100),
  earningsTotal: z.number().nonnegative(),
  earningsPending: z.number().nonnegative(),
  lastHeartbeat: z.number().int().positive(),
  registeredAt: z.number().int().positive(),
  isGenesis: z.boolean(),
})

export const CreateNodeSchema = z.object({
  operator: z.string().min(1),
  hardware: HardwareSchema,
  location: z.string().min(1),
})

export const UpdateNodeSchema = z.object({
  status: NodeStatusSchema.optional(),
  hardware: HardwareSchema.optional(),
  location: z.string().optional(),
})

export type ProviderNode = z.infer<typeof ProviderNodeSchema>
export type CreateNode = z.infer<typeof CreateNodeSchema>
export type UpdateNode = z.infer<typeof UpdateNodeSchema>
export type HardwareSpec = z.infer<typeof HardwareSchema>
export type NodeStatus = z.infer<typeof NodeStatusSchema>
export type Heartbeat = z.infer<typeof HeartbeatSchema>