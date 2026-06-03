"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ConnectionLostPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleReconnect = () => {
    // Simulate reconnection
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="text-6xl mb-6">📡</div>

      <h1 className="text-4xl font-bold mb-4">Connection Lost</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Network Disconnection</CardTitle>
          <CardDescription>
            We lost connection to our servers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Your internet connection may have been interrupted.
          </p>

          {countdown > 0 ? (
            <div className="bg-muted rounded-lg p-6 mb-4">
              <p className="text-sm text-muted-foreground mb-2">Auto-retry in</p>
              <p className="text-5xl font-bold text-primary">{countdown}</p>
              <p className="text-sm text-muted-foreground mt-2">seconds</p>
            </div>
          ) : (
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <p className="text-primary font-medium">Attempting to reconnect...</p>
            </div>
          )}

          <div className="flex justify-center gap-2 text-sm text-muted-foreground">
            <span>Check your</span>
            <a href="#" className="text-primary hover:underline">connection</a>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button variant="default" onClick={handleReconnect}>
          Reconnect Now
        </Button>
        <Button variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}