"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Coins, ArrowRight, HelpCircle, ExternalLink } from 'lucide-react'

export default function StakeInsufficientPage() {
  const requiredAmount = 500
  const currentAmount = 250
  const shortfall = requiredAmount - currentAmount

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          Stake
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
        <AlertTriangle className="h-10 w-10 text-amber-600" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Insufficient Stake</h1>

      <p className="mb-8 max-w-md text-center text-lg text-muted-foreground">
        Your current stake is below the minimum required amount.
      </p>

      {/* Stake Details */}
      <Card className="mb-8 w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-base">Stake Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Required Stake</span>
              <span className="font-semibold flex items-center gap-1">
                <Coins className="h-4 w-4 text-primary" />
                {requiredAmount.toLocaleString()} $MESH
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Stake</span>
              <span className="font-semibold flex items-center gap-1">
                <Coins className="h-4 w-4 text-muted-foreground" />
                {currentAmount.toLocaleString()} $MESH
              </span>
            </div>
            <div className="border-t pt-4 flex items-center justify-between">
              <span className="text-muted-foreground">Shortfall</span>
              <Badge variant="destructive" className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />
                {shortfall.toLocaleString()} $MESH
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <Link href="/stake-manager">
            <Coins className="h-4 w-4 mr-2" />
            Stake More
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/docs/getting-started">
            <HelpCircle className="h-4 w-4 mr-2" />
            Learn About Staking
          </Link>
        </Button>
      </div>

      {/* FAQ */}
      <Card className="mt-12 w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-sm mb-1">What is the minimum stake requirement?</p>
            <p className="text-sm text-muted-foreground">
              The minimum stake required to operate as a provider is 500 $MESH. This ensures
              network security and provides collateral for服务质量.
            </p>
          </div>
          <div>
            <p className="font-medium text-sm mb-1">Where can I buy $MESH tokens?</p>
            <p className="text-sm text-muted-foreground">
              You can purchase $MESH tokens on major exchanges. Check our documentation for
              a complete list of supported trading platforms.
            </p>
          </div>
          <div>
            <p className="font-medium text-sm mb-1">Can I unstake partially?</p>
            <p className="text-sm text-muted-foreground">
              Yes, but you must maintain the minimum stake of 500 $MESH. Unstaking below
              this amount will result in forced liquidation.
            </p>
          </div>
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Read full staking documentation
            <ExternalLink className="h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}