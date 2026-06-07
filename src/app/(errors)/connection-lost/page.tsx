"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from "react"

export default function ConnectionLostPage() {
  const [countdown, setCountdown] = useState(10)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRetry()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRetry = () => {
    setIsRetrying(true)
    window.location.reload()
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          Error
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <WifiOff className="h-10 w-10 text-destructive" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Connection Lost</h1>

      <p className="mb-2 max-w-md text-center text-lg text-muted-foreground">
        We lost connection to the server.
      </p>

      <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
        Check your internet connection. Your session may have been paused.
      </p>

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <span className="text-sm text-yellow-500">
          Auto-retry in <span className="font-mono font-medium">{countdown}</span> seconds
        </span>
      </div>

      {isRetrying ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Reconnecting...</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleRetry} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Now
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            ArrowRight Back
          </Button>
        </div>
      )}

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            If the problem persists, your session data has been preserved.{" "}
            <Link
              href="/sessions"
              className="text-primary underline-offset-4 hover:underline"
            >
              View your sessions
            </Link>{" "}
            to resume where you left off.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Link({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}