"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const presetAmounts = [100, 500, 1000]

export default function StakeSetupPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500)
  const [customAmount, setCustomAmount] = useState("")

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const estimatedRewards = selectedAmount ? (selectedAmount * 0.12).toFixed(2) : customAmount ? (parseFloat(customAmount) * 0.12).toFixed(2) : "0.00"

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Stake MESH Tokens</h1>
        <p className="text-muted-foreground">
          Stake to unlock provider benefits and earn rewards
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Why Stake?</CardTitle>
          <CardDescription>
            Staking MESH tokens enables you to run provider nodes and earn:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">2x</span> Genesis multiplier on all compute earnings
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">Priority</span> access to new agent listings
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">Reduced</span> platform fees (0% during Genesis)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">Governance</span> voting rights on protocol updates
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Stake Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {presetAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                onClick={() => handleAmountSelect(amount)}
                className="h-16 text-lg font-bold"
              >
                {amount}
              </Button>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <label htmlFor="custom" className="text-sm font-medium">Or enter custom amount</label>
            <Input
              id="custom"
              type="number"
              placeholder="Enter MESH amount"
              value={customAmount}
              onChange={(e) => handleCustomChange(e.target.value)}
            />
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Potential Annual Rewards (12% APY)</span>
              <span className="text-2xl font-bold text-primary">{estimatedRewards} MESH</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          <Link href="/onboarding/role-selection">Back</Link>
        </Button>
        <Button variant="ghost" className="flex-1">
          Skip for now
        </Button>
        <Button variant="default" className="flex-1">
          <Link href="/onboarding/cli-installation">Continue</Link>
        </Button>
      </div>
    </div>
  )
}