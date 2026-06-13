'use client'

import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { createLoginMessage } from '@/lib/auth/signature'

interface AccountLinkButtonProps {
  onLinked?: () => void
}

export function AccountLinkButton({ onLinked }: AccountLinkButtonProps) {
  const { address, isConnected } = useAccount()
  const { data: session, update } = useSession()
  const { signMessageAsync } = useSignMessage()
  const [isLoading, setIsLoading] = useState(false)

  // User is OAuth logged in but no wallet linked
  const needsWalletLink = session?.user && !address
  // User is wallet logged in but no OAuth linked
  const needsOAuthLink = address && !session?.user?.email

  const handleLinkWallet = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      // Create a login message for the user to sign
      const message = createLoginMessage(address)

      // Request signature from wallet
      const signature = await signMessageAsync({ message })

      // Call the link-wallet API
      const response = await fetch('/api/auth/link-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, message }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to link wallet')
      }

      // Refresh the session to get updated address
      await update()

      toast.success('Wallet linked successfully!')
      onLinked?.()
    } catch (error) {
      console.error('Failed to link wallet:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to link wallet')
    } finally {
      setIsLoading(false)
    }
  }

  // No linking needed
  if (!needsWalletLink && !needsOAuthLink) {
    return null
  }

  if (needsWalletLink) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Connect Your Wallet</CardTitle>
          <CardDescription className="text-xs">
            Link your Ethereum wallet to enable full Web3 features
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleLinkWallet}
            disabled={!isConnected || isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (needsOAuthLink) {
    return (
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Link Social Account</CardTitle>
          <CardDescription className="text-xs">
            Connect Google, GitHub, or Discord for easier recovery
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname)}
          >
            Link Social Account
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}

// Hook to check if wallet is linked to current session
export function useWalletLinked() {
  const { address, isConnected } = useAccount()
  const { data: session } = useSession()

  return {
    isLinked: !!session?.address,
    address: session?.address ?? address,
    isConnected,
    isOAuthUser: !!session?.user?.email,
  }
}