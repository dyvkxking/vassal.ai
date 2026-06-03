import { z } from 'zod'

const envSchema = z.object({
  // Client-side (NEXT_PUBLIC_)
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_CHAIN_ID: z.coerce.number().default(1),
  NEXT_PUBLIC_CONTRACT_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),

  // Server-side
  DATABASE_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
})

// Validate at runtime, throw if invalid
function validateEnv() {
  const obj = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  }

  const result = envSchema.safeParse(obj)
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }
  return result.data
}

export const env = validateEnv()