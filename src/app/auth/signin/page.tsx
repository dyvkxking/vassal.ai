'use client'

import { Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCallback, useState } from 'react'

// OAuth provider icons (simple SVG icons)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#5865F2">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.994a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 010-4h14v4" />
    <path d="M3 5v14a2 2 0 002 2h16v-5" />
    <path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
)

type Provider = 'google' | 'github' | 'discord' | 'wallet'

interface OAuthButtonProps {
  provider: Provider
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}

function OAuthButton({ provider, icon, label, onClick, disabled }: OAuthButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full h-12 gap-3"
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
    </Button>
  )
}

function SignInContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const error = searchParams.get('error')
  const [isLoading, setIsLoading] = useState<Provider | null>(null)

  const handleOAuthSignIn = useCallback(async (provider: Provider) => {
    setIsLoading(provider)
    await signIn(provider, { callbackUrl })
  }, [callbackUrl])

  const handleWalletSignIn = useCallback(async () => {
    setIsLoading('wallet')
    await signIn('credentials', { callbackUrl: callbackUrl ?? '/' })
  }, [callbackUrl])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to vassal.ai</CardTitle>
          <CardDescription>
            Sign in to access the decentralized AI agent marketplace
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error === 'OAuthAccountNotLinked' ? (
                <>An account with this email already exists. Try a different sign-in method.</>
              ) : (
                <>Sign-in failed. Please try again.</>
              )}
            </div>
          )}

          <div className="space-y-3">
            <OAuthButton
              provider="google"
              icon={<GoogleIcon />}
              label="Continue with Google"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading !== null}
            />

            <OAuthButton
              provider="github"
              icon={<GitHubIcon />}
              label="Continue with GitHub"
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading !== null}
            />

            <OAuthButton
              provider="discord"
              icon={<DiscordIcon />}
              label="Continue with Discord"
              onClick={() => handleOAuthSignIn('discord')}
              disabled={isLoading !== null}
            />
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <OAuthButton
            provider="wallet"
            icon={<WalletIcon />}
            label="Connect Wallet"
            onClick={handleWalletSignIn}
            disabled={isLoading !== null}
          />

          <div className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
          </div>

          <Badge variant="outline" className="w-full justify-center py-2">
            New to vassal.ai?{' '}
            <a href="/auth/signup" className="text-primary ml-1">Create an account</a>
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}