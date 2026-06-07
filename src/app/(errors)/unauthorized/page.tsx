"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, ShieldOff, AlertCircle } from 'lucide-react'
import { useState } from "react"

interface UnauthorizedPageProps {
  searchParams: Promise<{
    connected?: string
    role?: string
    returnUrl?: string
  }>
}

export default function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const [resolvedParams] = useState(async () => {
    try {
      return await searchParams
    } catch {
      return { connected: "false", role: "", returnUrl: "/" }
    }
  })

  const connected = resolvedParams && 'connected' in resolvedParams ? resolvedParams.connected === "true" : false
  const role = resolvedParams && 'role' in resolvedParams ? String(resolvedParams.role || "") : ""
  const returnUrl = resolvedParams && 'returnUrl' in resolvedParams ? String(resolvedParams.returnUrl || "/") : "/"

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          401
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">
        {connected ? (
          <ShieldOff className="h-10 w-10 text-blue-500" />
        ) : (
          <Wallet className="h-10 w-10 text-blue-500" />
        )}
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Unauthorized Access</h1>

      {connected ? (
        <>
          <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>

          <div className="mb-6 w-full max-w-md space-y-3 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Required Role</span>
            </div>
            <div className="flex justify-center">
              <code className="rounded bg-background px-3 py-1 text-sm font-mono font-medium">
                {role || "admin"}
              </code>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Your current wallet does not have the required permissions.
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
            Connect your wallet to access this page and participate in the marketplace.
          </p>

          <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Wallet not connected
            </span>
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {connected ? (
          <>
            <Button size="lg">
              <Link href={returnUrl}>ArrowRight Back</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/contact">Contact Admin</Link>
            </Button>
          </>
        ) : (
          <>
            <Button size="lg">
              <Link href="/welcome" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/docs/getting-started">Learn More</Link>
            </Button>
          </>
        )}
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            New to vassal.ai?{" "}
            <Link href="/welcome" className="text-primary underline-offset-4 hover:underline">
              Start onboarding
            </Link>{" "}
            to set up your account and access the marketplace.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}