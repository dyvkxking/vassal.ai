import { z } from 'zod'
import { AGENT_CATEGORIES } from '@/constants'

// ============ AGENT ============

export const AgentCapabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tpmRequired: z.number().int().nonnegative(),
  category: z.string(),
})

export const SLAParamsSchema = z.object({
  latencyThresholdMs: z.number().int().nonnegative(),
  tpmCap: z.number().int().nonnegative(),
  uptimeGuaranteePercent: z.number().min(0).max(100),
  minStakeRequired: z.number().nonnegative(),
})

export const PricingTierSchema = z.object({
  name: z.string(),
  tpmCap: z.number().int().nonnegative(),
  pricePerMinute: z.number().nonnegative(),
})

export const PricingSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('per_minute'),
    pricePerMinute: z.number().nonnegative(),
  }),
  z.object({
    type: z.literal('per_second'),
    pricePerSecond: z.number().nonnegative(),
  }),
  z.object({
    type: z.literal('flat_rate'),
    flatPrice: z.number().nonnegative(),
  }),
  z.object({
    type: z.literal('tiered'),
    tiers: z.array(PricingTierSchema).min(1),
  }),
  z.object({
    type: z.literal('per_call'),
    pricePerCall: z.number().nonnegative().optional(),
  }),
])

export const AgentCategorySchema = z.enum(AGENT_CATEGORIES)

export const AgentStatusSchema = z.enum(['active', 'paused', 'draft', 'archived'])

export const AgentSchema = z.object({
  id: z.string(),
  creator: z.string(),
  name: z.string(),
  description: z.string(),
  category: AgentCategorySchema,
  capabilities: z.array(AgentCapabilitySchema),
  slaParams: SLAParamsSchema,
  pricing: PricingSchema,
  qualityScore: z.number().min(0).max(1),
  totalSessions: z.number().int().nonnegative(),
  avgRating: z.number().min(0).max(5),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
  status: AgentStatusSchema,
  skillDependencies: z.array(z.string()),
  avatarUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  learningEnabled: z.boolean(),
  version: z.string(),
})

export const CreateAgentSchema = AgentSchema.omit({
  id: true,
  qualityScore: true,
  totalSessions: true,
  avgRating: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  version: true,
}).extend({
  creator: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(5000),
  category: AgentCategorySchema,
  capabilities: z.array(AgentCapabilitySchema).min(1),
  slaParams: SLAParamsSchema,
  pricing: PricingSchema,
  skillDependencies: z.array(z.string()).default([]),
  learningEnabled: z.boolean().default(false),
})

export const UpdateAgentSchema = AgentSchema.partial().omit({
  id: true,
  creator: true,
  qualityScore: true,
  totalSessions: true,
  avgRating: true,
  createdAt: true,
  updatedAt: true,
  version: true,
})

export type Agent = z.infer<typeof AgentSchema>
export type CreateAgent = z.infer<typeof CreateAgentSchema>
export type UpdateAgent = z.infer<typeof UpdateAgentSchema>
export type AgentCapability = z.infer<typeof AgentCapabilitySchema>
export type PricingModel = z.infer<typeof PricingSchema>
export type SLAParams = z.infer<typeof SLAParamsSchema>
export type AgentCategory = z.infer<typeof AgentCategorySchema>