import { z } from 'zod'
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@/constants'

// ============ COMMON / CRYPTO ============

// Ethereum address: 0x + 40 hex chars
export const EthAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

// Transaction hash: 0x + 64 hex chars
export const TxHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')

// Signature: 0x + 130 hex chars (65 bytes)
export const SignatureSchema = z.string().regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature')

// URL validation
export const UrlSchema = z.string().url()

// Timestamp validators
export const isFutureTimestamp = (val: number): boolean => val > Date.now()
export const isPastTimestamp = (val: number): boolean => val < Date.now()

export const FutureTimestampSchema = z.number().refine(isFutureTimestamp, {
  message: 'Timestamp must be in the future',
})

export const PastTimestampSchema = z.number().refine(isPastTimestamp, {
  message: 'Timestamp must be in the past',
})

// Range validator factory
export const isWithinRange = (min: number, max: number) => (val: number): boolean =>
  val >= min && val <= max

export const withinRange = (min: number, max: number, message?: string) =>
  z.number().refine(isWithinRange(min, max), {
    message: message ?? `Value must be between ${min} and ${max}`,
  })

// Positive integer
export const PositiveIntSchema = z.number().int().positive()

// Non-negative integer
export const NonNegativeIntSchema = z.number().int().nonnegative()

// ============ PAGINATION ============

export const SortDirectionSchema = z.enum(['asc', 'desc'])

export const SortSchema = z.object({
  field: z.string().min(1),
  direction: SortDirectionSchema.default('desc'),
})

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
})

export const CursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
})

// ============ ERROR RESPONSES ============

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
})

export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
})

export const AuthErrorSchema = z.object({
  message: z.string(),
  code: z.enum(['unauthorized', 'forbidden', 'not_found']),
})