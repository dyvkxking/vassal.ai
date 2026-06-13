import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyWalletSignature } from './signature'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
    // Email/password credentials provider
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          // No user found or user has no password set (social login only)
          return null
        }

        const passwordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    // Keep wallet signature verification as a credentials provider
    CredentialsProvider({
      name: 'Wallet',
      credentials: {
        address: { label: 'Address', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        message: { label: 'Message', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.signature || !credentials?.message) {
          return null
        }

        // Verify wallet signature using existing verifyWalletSignature
        const valid = await verifyWalletSignature(
          credentials.message as string,
          credentials.address as string,
          credentials.signature as string
        )

        if (!valid) return null

        // Find or create user linked to this wallet
        let user = await prisma.user.findUnique({
          where: { address: credentials.address as string },
        })

        if (!user) {
          // Create a new user with this wallet address
          user = await prisma.user.create({
            data: {
              address: credentials.address as string,
            },
          })
        }

        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Track wallet address in token for wallet-based logins
      if (account?.provider === 'credentials' && account.type === 'credentials') {
        // Wallet credentials - store address in token
        token.address = account.providerAccountId
      }
      // Also store address if user has it linked
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, address: true },
        })
        if (dbUser) {
          token.address = dbUser.address
          token.id = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      // Expose wallet address and user id in session
      if (token.address) {
        session.address = token.address as string
      }
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  trustHost: true,
})

// Extend session type
declare module 'next-auth' {
  interface Session {
    address?: string
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}