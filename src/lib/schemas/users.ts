import { z } from 'zod'

// ============ USER / PROFILE ============

export const RolesSchema = z.array(z.enum(['creator', 'provider', 'client', 'governor', 'admin']))

export const UserStatsSchema = z.object({
  totalSessionsAsProvider: z.number().int().nonnegative(),
  totalSessionsAsClient: z.number().int().nonnegative(),
  agentsCreated: z.number().int().nonnegative(),
  skillsPublished: z.number().int().nonnegative(),
  proposalsVoted: z.number().int().nonnegative(),
})

export const UserProfileSchema = z.object({
  address: z.string(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
  roles: RolesSchema,
  stats: UserStatsSchema,
  isGenesisParticipant: z.boolean(),
  joinedAt: z.number().int().positive(),
})

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>
export type UserStats = z.infer<typeof UserStatsSchema>
export type UserRole = z.infer<typeof RolesSchema>[number]