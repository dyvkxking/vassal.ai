'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn } from 'next-auth/react'

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'Error starting OAuth sign-in. Please try again.',
  OAuthCallback: 'Error during OAuth callback. Please try again.',
  OAuthCreateAccount: 'Could not create your account. Please try again.',
  EmailCreateAccount: 'Could not create your account with that email. Please try again.',
  Callback: 'Callback error. Please try again.',
  OAuthAccountNotLinked: 'This email is already registered with a different sign-in method.',
  EmailSignin: 'Could not send the sign-in email. Please try again.',
  CredentialsSignin: 'Invalid credentials. Please check your wallet signature.',
  default: 'An authentication error occurred. Please try again.',
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') ?? 'default'
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl">Authentication Failed</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn(undefined, { callbackUrl: '/' })}
          >
            Back to Sign In
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            If this problem persists, please{' '}
            <a href="/contact" className="underline hover:text-foreground">
              contact support
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}