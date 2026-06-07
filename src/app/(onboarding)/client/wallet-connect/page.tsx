"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Circle, Wallet, Shield, HelpCircle } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: Circle },
  { number: 2, label: "Choose Role", icon: Circle },
  { number: 3, label: "Setup", icon: Circle },
]

const WALLET_OPTIONS = [
  { id: "metamask", name: "MetaMask", icon: "🦊" },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗" },
  { id: "coinbase", name: "Coinbase", icon: "💰" },
  { id: "rainbow", name: "Rainbow", icon: "🌈" },
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
                        step.number === 1
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        step.number === 1 ? "text-foreground" : "text-muted-foreground"
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

          {/* Wallet Options */}
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-semibold">Connect Your Wallet</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Choose a wallet to connect to vassal.ai
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {WALLET_OPTIONS.map((wallet) => (
                <Card key={wallet.id} className="cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl">
                        {wallet.icon}
                      </div>
                      <CardTitle className="text-base">{wallet.name}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* RainbowKit Connect Button */}
          <div className="flex flex-col items-center gap-4">
            <Separator />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Or connect using RainbowKit
              </p>
              <ConnectButton />
            </div>
          </div>

          {/* Why Connect Wallet */}
          <div className="mt-10 rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/20">
                <HelpCircle className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Why connect your wallet?</h3>
                <p className="text-sm text-muted-foreground">
                  Your wallet is your identity on the Somnia L1 blockchain. Connecting allows you to
                  securely rent agents, manage payments, and track your session history — all without
                  traditional sign-ups or passwords.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <Wallet className="h-4 w-4 text-emerald-600" />
                <span className="text-sm">Secure payments via blockchain</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-sm">Decentralized identity</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <Circle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm">No traditional sign-ups</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href="/welcome">
              <Button variant="ghost">← Back</Button>
            </Link>
            <Link href="/client/role-selection">
              <Button>Continue →</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}