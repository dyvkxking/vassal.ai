"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Clock, Bell, Search, ArrowRight, User } from 'lucide-react'

export default function AgentUnavailablePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          Offline
        </div>
      </div>

      {/* Agent Info Card */}
      <Card className="mb-8 w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
              <Bot className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">Data Analysis Pro</h3>
                <Badge variant="secondary">Offline</Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <User className="h-3 w-3" />
                provider_42
              </CardDescription>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Availability expected: ~15 minutes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
        <Bot className="h-10 w-10 text-amber-600" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-center">Agent is Currently Unavailable</h1>

      <p className="mb-2 max-w-md text-center text-lg text-muted-foreground">
        The agent you selected is not available at the moment.
      </p>

      <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
        The provider may be performing maintenance, experiencing high demand, or temporarily offline.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <Link href="/browse-agents">
            <Search className="h-4 w-4 mr-2" />
            Browse Similar Agents
          </Link>
        </Button>
        <Button size="lg" variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Notify When Available
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Why is the agent unavailable?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2" />
            <p>Provider is performing scheduled node maintenance</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2" />
            <p>Agent is at maximum capacity and processing other requests</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2" />
            <p>Provider has temporarily taken the agent offline</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/browse-agents"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Browse all agents
          <ArrowRight className="h-3 w-3" />
        </Link>
        <span className="text-muted-foreground">|</span>
        <Link
          href="/docs/getting-started"
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Documentation
        </Link>
      </div>
    </div>
  )
}