"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Wallet, Shield, Lock, Star } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2, status: "current" },
  { number: 2, label: "Stake Setup", icon: Circle, status: "pending" },
  { number: 3, label: "CLI Install", icon: Circle, status: "pending" },
  { number: 4, label: "First Session", icon: Circle, status: "pending" },
  { number: 5, label: "Create Agent", icon: Circle, status: "pending" },
]

const WALLET_OPTIONS = [
  { id: "metamask", name: "MetaMask", icon: "🦊", popular: true },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗", popular: false },
  { id: "coinbase", name: "Coinbase", icon: "💰", popular: false },
  { id: "rainbow", name: "Rainbow", icon: "🌈", popular: false },
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
          {/* Welcome Headline */}
          <div className="mb-10 text-center">
            <Badge variant="secondary" className="mb-4">Provider Onboarding</Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Connect Your Wallet</h1>
            <p className="text-lg text-muted-foreground">
              Connect your wallet to start earning as a compute provider on vassal.ai
            </p>
          </div>

          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        step.status === "current"
                          ? "border-primary bg-primary text-primary-foreground"
                          : step.status === "completed"
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-muted-foreground/30 text-muted-foreground/30"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`mt-1.5 text-xs ${
                        step.status === "current" ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`mx-2 h-px w-8 ${step.status === "completed" ? "bg-primary" : "bg-muted-foreground/20"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Options */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Select your wallet</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {WALLET_OPTIONS.map((wallet) => (
                <Card key={wallet.id} className="cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{wallet.icon}</span>
                        <CardTitle className="text-base">{wallet.name}</CardTitle>
                      </div>
                      {wallet.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* RainbowKit Connect Button */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <ConnectButton />
          </div>

          {/* Why connect wallet explanation */}
          <Accordion className="w-full">
            <AccordionItem value="why-wallet">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Why do I need to connect a wallet?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Your wallet is your identity on the Somnia blockchain. It allows you to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Receive payments in $MESH for providing compute resources</li>
                    <li>Stake $MESH as collateral to become a verified provider</li>
                    <li>Sign transactions securely without sharing sensitive data</li>
                    <li>Build your reputation and track earnings over time</li>
                  </ul>
                  <p className="font-medium text-foreground">
                    Your private keys never leave your wallet — we never ask for them.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Skip option */}
          <div className="flex justify-center mt-8">
            <Button variant="ghost" disabled className="text-muted-foreground text-sm">
              <Lock className="mr-2 h-4 w-4" />
              Skip for now (you can connect later)
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}