"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StopCircle, Clock, Coins, Zap, RefreshCw } from 'lucide-react'

interface SessionTerminatedPageProps {
  searchParams: Promise<{
    reason?: string
    duration?: string
    cost?: string
    tpmUsed?: string
    refundAmount?: string
  }>
}

function formatDuration(seconds: string): string {
  const secs = Number.parseInt(seconds, 10)
  const mins = Math.floor(secs / 60)
  const hours = Math.floor(mins / 60)
  if (hours > 0) {
    return `${hours}h ${mins % 60}m`
  }
  return `${mins}m ${secs % 60}s`
}

export default async function SessionTerminatedPage({
  searchParams,
}: SessionTerminatedPageProps) {
  const params = await searchParams.catch(() => ({
    reason: "provider-initiated",
    duration: "0",
    cost: "0.00",
    tpmUsed: "0",
    refundAmount: "0.00",
  }))

  const { reason = "provider-initiated", duration = "0", cost = "0.00", tpmUsed = "0", refundAmount = "0.00" } = params

  const reasonLabels: Record<string, string> = {
    "provider-initiated": "Provider Initiated",
    "sla-breach": "SLA Breach",
    manual: "Manual Termination",
  }

  const reasonColors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    "provider-initiated": "default",
    "sla-breach": "destructive",
    manual: "secondary",
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          Ended
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <StopCircle className="h-10 w-10 text-destructive" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Session Terminated</h1>

      <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
        Your session has been ended.
      </p>

      <div className="mb-6">
        <Badge variant={reasonColors[reason] || "default"}>
          {reasonLabels[reason] || reason}
        </Badge>
      </div>

      <div className="mb-6 w-full max-w-md space-y-3 rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Duration</span>
          </div>
          <span className="font-mono font-medium">{formatDuration(duration)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span className="text-sm">Session Cost</span>
          </div>
          <span className="font-mono font-medium">${cost}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span className="text-sm">TPM Used</span>
          </div>
          <span className="font-mono font-medium">{Number(tpmUsed).toLocaleString()}</span>
        </div>
        {Number(refundAmount) > 0 && (
          <>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-500">Refund Amount</span>
                <span className="font-mono font-bold text-green-500">${refundAmount}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Refund has been automatically processed to your wallet.
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg">
          <Link href="/launcher" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Start New Session
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/session-history">View Session History</Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Need to dispute this termination?{" "}
            <Link
              href="mailto:support@vassal.ai"
              className="text-primary underline-offset-4 hover:underline"
            >
              Contact support
            </Link>{" "}
            with your session details.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}