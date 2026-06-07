import { z } from 'zod'

// ============ STAKE ============

export const PurposeSchema = z.enum(['provider', 'agent', 'delegation'])

export const StakePositionSchema = z.object({
  id: z.string(),
  owner: z.string(),
  amount: z.number().nonnegative(),
  lockedAmount: z.number().nonnegative(),
  purpose: PurposeSchema,
  associatedEntity: z.string().optional(),
  createdAt: z.number().int().positive(),
  unlockingAt: z.number().int().positive().optional(),
})

export const LockStakeSchema = z.object({
  amount: z.number().positive(),
  purpose: PurposeSchema,
  associatedEntity: z.string().optional(),
})

export const UnlockStakeSchema = z.object({
  positionId: z.string().min(1),
  amount: z.number().positive().optional(), // partial unlock
})

export const ClaimRewardsSchema = z.object({
  positionId: z.string().min(1),
})

export const UnlockRequestSchema = z.object({
  id: z.string(),
  owner: z.string(),
  amount: z.number().positive(),
  requestTime: z.number().int().positive(),
  releaseTime: z.number().int().positive(),
  status: z.enum(['pending', 'ready', 'claimed']),
})

export type StakePosition = z.infer<typeof StakePositionSchema>
export type LockStake = z.infer<typeof LockStakeSchema>
export type UnlockStake = z.infer<typeof UnlockStakeSchema>
export type ClaimRewards = z.infer<typeof ClaimRewardsSchema>
export type UnlockRequest = z.infer<typeof UnlockRequestSchema>
export type Purpose = z.infer<typeof PurposeSchema>