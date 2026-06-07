import { z } from 'zod'

// ============ SKILL ============

export const SkillStatusSchema = z.enum(['draft', 'under_review', 'approved', 'rejected', 'deprecated', 'pending'])

export const ParameterSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  description: z.string(),
})

export const SkillExampleSchema = z.object({
  input: z.record(z.string(), z.unknown()),
  output: z.record(z.string(), z.unknown()),
})

export const SkillSpecSchema = z.object({
  inputSchema: z.record(z.string(), z.unknown()),
  outputSchema: z.record(z.string(), z.unknown()),
  parameters: z.array(ParameterSchema),
  examples: z.array(SkillExampleSchema),
})

export const SkillSchema = z.object({
  id: z.string(),
  author: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  version: z.string(),
  pricePerInvocation: z.number().nonnegative(),
  usageCount: z.number().int().nonnegative(),
  avgRating: z.number().min(0).max(5),
  status: SkillStatusSchema,
  spec: SkillSpecSchema,
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
})

export const CreateSkillSchema = SkillSchema.omit({
  id: true,
  usageCount: true,
  avgRating: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  version: true,
}).extend({
  author: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(5000),
  category: z.string().min(1),
  pricePerInvocation: z.number().nonnegative().default(0),
  spec: SkillSpecSchema,
})

export const UpdateSkillSchema = SkillSchema.partial().omit({
  id: true,
  author: true,
  createdAt: true,
  updatedAt: true,
  version: true,
})

export type Skill = z.infer<typeof SkillSchema>
export type CreateSkill = z.infer<typeof CreateSkillSchema>
export type UpdateSkill = z.infer<typeof UpdateSkillSchema>
export type SkillSpec = z.infer<typeof SkillSpecSchema>
export type SkillParameter = z.infer<typeof ParameterSchema>
export type SkillStatus = z.infer<typeof SkillStatusSchema>