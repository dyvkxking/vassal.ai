"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

function generateErrorId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function ServerErrorPage() {
  const errorId = generateErrorId()

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          500
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Something went wrong</h1>

      <p className="mb-2 max-w-md text-center text-lg text-muted-foreground">
        We encountered an unexpected error while processing your request.
      </p>

      <p className="mb-8 text-sm text-muted-foreground">
        Please try again or contact support if the problem persists.
      </p>

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2">
        <span className="text-xs text-muted-foreground">Error ID:</span>
        <code className="text-sm font-mono font-medium">{errorId}</code>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => window.location.reload()} size="lg">
          Retry
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="mailto:support@vassal.ai">Contact support</Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            If you need immediate assistance,{" "}
            <Link
              href="mailto:support@vassal.ai"
              className="text-primary underline-offset-4 hover:underline"
            >
              email our support team
            </Link>{" "}
            with the error ID above.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}