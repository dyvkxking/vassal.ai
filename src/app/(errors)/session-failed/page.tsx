"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, RefreshCw, History, Flag } from 'lucide-react'
import { useState } from "react"

interface SessionFailedPageProps {
  searchParams: Promise<{
    sessionId?: string
    reason?: string
    timestamp?: string
    refundAmount?: string
    slaBreach?: string
  }>
}

function formatTimestamp(timestamp: string): string {
  try {
    return new Date(timestamp).toLocaleString()
  } catch {
    return timestamp
  }
}

export default function SessionFailedPage({ searchParams }: SessionFailedPageProps) {
  const [params] = useState(() => ({ timeout: 0, ...{} }))
  const [resolvedParams] = useState(async () => {
    try {
      return await searchParams
    } catch {
      return { sessionId: "UNKNOWN", reason: "Connection lost", timestamp: new Date().toISOString() }
    }
  })

  // In real implementation, use use() hook to unwrap the promise
  const sessionId = resolvedParams && 'sessionId' in resolvedParams ? String(resolvedParams.sessionId ?? "SESSION-12345") : "SESSION-12345"
  const reason = resolvedParams && 'reason' in resolvedParams ? String(resolvedParams.reason ?? "Connection timeout") : "Connection timeout"
  const timestamp = resolvedParams && 'timestamp' in resolvedParams ? String(resolvedParams.timestamp ?? new Date().toISOString()) : new Date().toISOString()
  const refundAmount = resolvedParams && 'refundAmount' in resolvedParams ? String(resolvedParams.refundAmount ?? "0.00") : "0.00"
  const slaBreach = resolvedParams && 'slaBreach' in resolvedParams ? String(resolvedParams.slaBreach ?? "false") : "false"

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          Error
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Session Failed</h1>

      <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
        Your session encountered an error and could not be completed.
      </p>

      <div className="mb-6 w-full max-w-md space-y-3 rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Session ID</span>
          <code className="text-sm font-mono font-medium">{sessionId}</code>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Failure Reason</span>
          <span className="text-sm font-medium">{reason}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Time of Failure</span>
          <span className="text-sm">{formatTimestamp(timestamp)}</span>
        </div>
        {slaBreach === "true" && (
          <div className="pt-2">
            <Badge variant="destructive" className="w-full justify-center">
              SLA Breach - Refund Eligible
            </Badge>
          </div>
        )}
        {Number(refundAmount) > 0 && (
          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-sm font-medium">Refund Amount</span>
            <span className="text-sm font-bold text-green-500">${refundAmount}</span>
          </div>
        )}
      </div>

      {slaBreach === "true" && (
        <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
          An SLA breach has been detected. A refund has been automatically initiated.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg">
          <Link href="/session-history" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Session
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/session-history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            View History
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/contact" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Report Issue
          </Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              href="mailto:support@vassal.ai"
              className="text-primary underline-offset-4 hover:underline"
            >
              Contact support
            </Link>{" "}
            with your session ID for assistance.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}