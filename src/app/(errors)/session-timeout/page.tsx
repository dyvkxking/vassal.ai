"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, LogIn, Activity, ArrowRight } from 'lucide-react'

export default function SessionTimeoutPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          Timeout
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
        <Clock className="h-10 w-10 text-amber-600" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Session Expired</h1>

      <p className="mb-2 max-w-md text-center text-lg text-muted-foreground">
        Your session has expired due to inactivity.
      </p>

      <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
        For your security, sessions automatically end after a period of inactivity.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <Link href="/welcome">
            <LogIn className="h-4 w-4 mr-2" />
            Log Back In
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/sessions">
            <Activity className="h-4 w-4 mr-2" />
            View Active Sessions
          </Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md">
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2 font-medium">Why did my session expire?</p>
            <p>
              Sessions expire after 15 minutes of inactivity to protect your account and funds.
              You can adjust session duration in your account settings.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
        <Link href="/docs/getting-started" className="hover:text-primary underline-offset-4 hover:underline">
          Documentation
        </Link>
        <span>|</span>
        <Link href="/contact" className="hover:text-primary underline-offset-4 hover:underline">
          Support
        </Link>
      </div>
    </div>
  )
}