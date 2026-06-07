"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Key, RefreshCw } from 'lucide-react'
import { useState, useEffect } from "react"

interface RateLimitedPageProps {
  searchParams: Promise<{
    limit?: string
    window?: string
    resetTime?: string
    retryAfter?: string
  }>
}

function formatResetTime(resetTime: string): string {
  try {
    const date = new Date(resetTime)
    return date.toLocaleTimeString()
  } catch {
    return resetTime
  }
}

export default function RateLimitedPage({ searchParams }: RateLimitedPageProps) {
  const [countdown, setCountdown] = useState(60)
  const [limitInfo, setLimitInfo] = useState({
    limit: "1000",
    window: "per minute",
    resetTime: new Date(Date.now() + 60000).toISOString(),
    retryAfter: "60",
  })

  useEffect(() => {
    searchParams.then(params => {
      if (params.limit) setLimitInfo(prev => ({ ...prev, limit: params.limit || prev.limit }))
      if (params.window) setLimitInfo(prev => ({ ...prev, window: params.window || prev.window }))
      if (params.resetTime) setLimitInfo(prev => ({ ...prev, resetTime: params.resetTime || prev.resetTime }))
      if (params.retryAfter) setCountdown(parseInt(params.retryAfter) || 60)
    }).catch(() => {})
  }, [searchParams])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          429
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
        <AlertTriangle className="h-10 w-10 text-orange-500" />
      </div>

      <Badge variant="outline" className="mb-4 px-3 py-1 text-base">
        Too Many Requests
      </Badge>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Rate Limit Exceeded</h1>

      <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
        You have reached the maximum number of requests allowed in a given time period.
      </p>

      <div className="mb-6 w-full max-w-md space-y-3 rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Rate Limit</span>
          <code className="text-sm font-mono font-medium">{limitInfo.limit} {limitInfo.window}</code>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Resets At</span>
          <span className="text-sm font-medium">{formatResetTime(limitInfo.resetTime)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Retry After</span>
          <span className="text-sm font-medium">{countdown}s</span>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-2">
        <Clock className="h-4 w-4 text-orange-500" />
        <span className="text-sm text-foreground">
          Wait <span className="font-mono font-medium">{countdown}</span> seconds before retrying
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => window.location.reload()}
          disabled={countdown > 0}
          size="lg"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Now
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/docs/api">API Docs</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent className="flex items-start gap-3">
          <Key className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            For higher rate limits, consider upgrading your API key.{" "}
            <Link href="/docs/api" className="text-primary underline-offset-4 hover:underline">
              Learn more
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}