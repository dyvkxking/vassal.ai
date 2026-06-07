"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Bot, ArrowRight } from 'lucide-react'

interface NotFoundPageProps {
  searchParams: Promise<{
    agentId?: string
    skillId?: string
    type?: string
  }>
}

export default function MarketplaceNotFoundPage({ searchParams }: NotFoundPageProps) {
  // In real implementation, use use() hook to unwrap the promise
  const agentId = "AGENT-12345"
  const type = "agent"

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          404
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10">
        <Bot className="h-10 w-10 text-violet-500" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Agent Not Found</h1>

      <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
        This agent may have been removed, is no longer available, or doesn&apos;t exist.
      </p>

      {agentId && (
        <div className="mb-6 w-full max-w-md rounded-lg border border-border bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Looking for</span>
            <code className="text-sm font-mono font-medium">{agentId}</code>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg">
          <Link href="/browse-agents" className="flex items-center gap-2">
            Browse Agents
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/docs/getting-started">View Docs</Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Looking for a specific capability?{" "}
            <Link href="/browse-agents" className="text-primary underline-offset-4 hover:underline">
              Browse our agent marketplace
            </Link>{" "}
            to discover available agents.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}