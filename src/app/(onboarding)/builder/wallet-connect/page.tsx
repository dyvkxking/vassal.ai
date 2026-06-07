"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Wallet, Smartphone, Building2, Rainbow, CheckCircle2 } from 'lucide-react'
import Link from "next/link"

const WALLET_OPTIONS = [
  {
    id: "metamask",
    icon: Wallet,
    name: "MetaMask",
    description: "Connect using browser extension",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "walletconnect",
    icon: Smartphone,
    name: "WalletConnect",
    description: "Scan with mobile wallet",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "coinbase",
    icon: Building2,
    name: "Coinbase",
    description: "Connect via Coinbase Wallet",
    color: "from-blue-400 to-blue-500",
  },
  {
    id: "rainbow",
    icon: Rainbow,
    name: "Rainbow",
    description: "Connect via Rainbow Wallet",
    color: "from-purple-500 to-pink-500",
  },
]

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2, active: true },
  { number: 2, label: "Choose Role", icon: CheckCircle2, active: false },
  { number: 3, label: "Stake Setup", icon: CheckCircle2, active: false },
]

export default function WalletConnectPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-foreground">vassal.ai</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        step.active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        step.active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="mx-4 h-px w-12 bg-muted-foreground/20" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Page Title */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Connect Your Wallet</h1>
            <p className="text-lg text-muted-foreground">
              Choose a wallet to connect and begin your builder journey on vassal.ai
            </p>
          </div>

          {/* Wallet Options */}
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            {WALLET_OPTIONS.map((wallet) => (
              <Card
                key={wallet.id}
                className="cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${wallet.color} flex items-center justify-center`}>
                      <wallet.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-base">{wallet.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{wallet.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connect CTA */}
          <div className="flex flex-col items-center gap-4">
            <Separator />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to get started as a builder
              </p>
              <ConnectButton />
            </div>
            <p className="text-xs text-muted-foreground">
              By connecting, you agree to our{" "}
              <Link href="/terms" className="underline-offset-4 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}