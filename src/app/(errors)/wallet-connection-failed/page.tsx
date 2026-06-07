"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, RefreshCw, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react'

export default function WalletConnectionFailedPage() {
  const troubleshootingSteps = [
    {
      title: "Check wallet extension",
      description: "Make sure your wallet extension is installed and enabled in your browser.",
      status: "todo" as const,
    },
    {
      title: "Try a different wallet",
      description: "Some wallets work better than others. Try switching to another wallet.",
      status: "todo" as const,
    },
    {
      title: "Check network settings",
      description: "Ensure you&apos;re connected to the correct network (Somnia L1).",
      status: "todo" as const,
    },
  ]

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

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Wallet Connection Failed</h1>

      <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
        We couldn&apos;t connect to your wallet.
      </p>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <Badge variant="outline">Rejected</Badge>
        <Badge variant="outline">Network Error</Badge>
        <Badge variant="outline">Extension Not Found</Badge>
      </div>

      <div className="mb-6 w-full max-w-md space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Troubleshooting Steps</h3>
        {troubleshootingSteps.map((step, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
              <span className="text-xs font-medium">{index + 1}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{step.title}</p>
              <p
                className="text-xs text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg">
          <Link href="/welcome" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/welcome" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Use a different wallet
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="mailto:support@vassal.ai" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
            <p className="text-center text-sm text-muted-foreground">
              Your assets remain secure. This is a connection issue, not a wallet drain.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}