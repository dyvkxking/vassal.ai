"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2, Circle, Terminal, Download, Smartphone, Monitor, Copy, Check, ArrowRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2, status: "completed" },
  { number: 2, label: "Stake Setup", icon: CheckCircle2, status: "completed" },
  { number: 3, label: "CLI Install", icon: CheckCircle2, status: "current" },
  { number: 4, label: "First Session", icon: Circle, status: "pending" },
  { number: 5, label: "Create Agent", icon: Circle, status: "pending" },
]

const OS_OPTIONS = [
  { id: "linux", name: "Terminal", icon: Terminal, recommended: true },
  { id: "macos", name: "macOS", icon: Smartphone, recommended: false },
  { id: "windows", name: "Monitor", icon: Monitor, recommended: false },
]

const INSTALL_COMMANDS = {
  linux: [
    { step: "Download the CLI", command: "curl -fsSL https://get.vassal.ai/cli | sh" },
    { step: "Initialize configuration", command: "vassal init" },
    { step: "Verify installation", command: "vassal --version" },
  ],
  macos: [
    { step: "Download the CLI", command: "brew install vassal-ai/tap/vassal" },
    { step: "Initialize configuration", command: "vassal init" },
    { step: "Verify installation", command: "vassal --version" },
  ],
  windows: [
    { step: "Download and run installer", command: "winget install vassal-ai.vassal" },
    { step: "Initialize configuration", command: "vassal init" },
    { step: "Verify installation", command: "vassal --version" },
  ],
}

const VERIFICATION_OUTPUT = `vassal version 1.0.0
OS: linux/amd64
Arch: x86_64
Built: 2026-06-01T00:00:00Z
License: MIT`

const TROUBLESHOOTING = [
  {
    issue: "Command not found after installation",
    solution: "Restart your terminal or run `source ~/.bashrc`. Make sure the install directory is in your PATH.",
  },
  {
    issue: "Permission denied during installation",
    solution: "Run the installation with sudo on Terminal/macOS, or run PowerShell as Administrator on Monitor.",
  },
  {
    issue: "Installation fails with network error",
    solution: "Check your internet connection and firewall settings. You may need to use a VPN if blocked in your region.",
  },
  {
    issue: "Antivirus blocks the download",
    solution: "Add an exception for vassal.ai in your antivirus software, or disable real-time protection temporarily.",
  },
]

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border bg-card">
      {label && (
        <div className="border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      )}
      <div className="flex items-center gap-2 p-3">
        <Terminal className="h-4 w-4 text-muted-foreground shrink-0" />
        <code className="flex-1 text-sm font-mono text-foreground overflow-x-auto">{code}</code>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export default function CliInstallPage() {
  const [selectedOS, setSelectedOS] = useState<"linux" | "macos" | "windows">("linux")
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)

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
            <Badge variant="secondary" className="mb-4">Step 3 of 5</Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Install Vassal CLI</h1>
            <p className="text-lg text-muted-foreground">
              Download and configure the command-line interface to manage your provider node
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

          {/* OS Selector */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Select your operating system</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {OS_OPTIONS.map((os) => (
                <Card
                  key={os.id}
                  className={`cursor-pointer transition-all ${
                    selectedOS === os.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedOS(os.id as "linux" | "macos" | "windows")}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-center gap-2 w-full">
                        <os.icon className="h-8 w-8 text-foreground" />
                        <CardTitle className="text-sm">{os.name}</CardTitle>
                        {os.recommended && (
                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Install Commands */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Installation steps</h2>
            <div className="space-y-4">
              {INSTALL_COMMANDS[selectedOS].map((cmd, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium">{cmd.step}</span>
                  </div>
                  <CodeBlock code={cmd.command} />
                </div>
              ))}
            </div>
          </div>

          {/* Verification */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Verify installation</h2>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Run the verification command to confirm CLI is working:
              </p>
              <CodeBlock code="vassal --version" label="terminal" />
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {VERIFICATION_OUTPUT}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mb-8">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowTroubleshooting(!showTroubleshooting)}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Troubleshooting
              </div>
              {showTroubleshooting ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            {showTroubleshooting && (
              <div className="mt-3 space-y-3">
                {TROUBLESHOOTING.map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{item.issue}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.solution}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Confirmation */}
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="w-full max-w-md">
              I&apos;ve installed the CLI
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Can&apos;t install?{" "}
              <Link href="/docs/getting-started" className="underline-offset-4 hover:underline">
                View full installation guide
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}