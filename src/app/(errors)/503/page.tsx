"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, RefreshCw } from 'lucide-react'
import { useState, useEffect } from "react"

export default function ServiceUnavailablePage() {
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.reload()
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
          503
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10">
        <Clock className="h-10 w-10 text-yellow-500" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Service Temporarily Unavailable</h1>

      <p className="mb-2 max-w-md text-center text-lg text-muted-foreground">
        We&apos;re performing scheduled maintenance.
      </p>

      <p className="mb-8 text-sm text-muted-foreground">
        Expected duration: approximately 30 minutes
      </p>

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2">
        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Retrying in <span className="font-mono font-medium">{countdown}</span> seconds...
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => window.location.reload()} size="lg">
          Retry now
        </Button>
        <Button variant="outline" size="lg">
          <Link href="https://status.vassal.ai" target="_blank">
            Check status
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            We apologize for the inconvenience. Follow{" "}
            <Link
              href="https://twitter.com/vassalai"
              target="_blank"
              className="text-primary underline-offset-4 hover:underline"
            >
              @vassalai
            </Link>{" "}
            for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}