"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Circle, Bot, Sparkles, ArrowRight, Rocket, SkipForward } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2, status: "completed" },
  { number: 2, label: "Stake Setup", icon: CheckCircle2, status: "completed" },
  { number: 3, label: "CLI Install", icon: CheckCircle2, status: "completed" },
  { number: 4, label: "First Session", icon: CheckCircle2, status: "completed" },
  { number: 5, label: "Create Agent", icon: CheckCircle2, status: "current" },
]

const AGENT_CATEGORIES = [
  { id: "data-processing", name: "Data Processing", icon: "📊", description: "Handle data transformations, aggregations, and analysis tasks" },
  { id: "content-generation", name: "Content Generation", icon: "✍️", description: "Create text, images, code, and multimedia content" },
  { id: "customer-support", name: "Customer Support", icon: "🎧", description: "Handle inquiries, tickets, and customer communications" },
  { id: "automation", name: "Workflow Automation", icon: "⚙️", description: "Automate repetitive tasks and business processes" },
  { id: "analytics", name: "Analytics & Insights", icon: "📈", description: "Generate insights, reports, and data visualizations" },
  { id: "security", name: "Security & Monitoring", icon: "🛡️", description: "Monitor systems, detect threats, and manage security" },
]

const AGENT_CAPABILITIES = [
  "Natural Language Processing",
  "Image Recognition",
  "Code Generation",
  "Data Analysis",
  "Task Automation",
  "Multi-modal Processing",
  "API Integration",
  "Custom Training",
]

const QUICK_START_TEMPLATES = [
  { name: "Data Analyzer Agent", category: "analytics", description: "Process and analyze datasets", popularity: "high" },
  { name: "Customer Support Bot", category: "customer-support", description: "Handle common support queries", popularity: "medium" },
  { name: "Content Generator", category: "content-generation", description: "Generate articles and social posts", popularity: "high" },
  { name: "Automation Workflow", category: "automation", description: "Automate repetitive tasks", popularity: "medium" },
]

export default function AgentCreationPage() {
  const [agentName, setAgentName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capability)
        ? prev.filter((c) => c !== capability)
        : [...prev, capability]
    )
  }

  const handleCreateAgent = () => {
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      window.location.href = "/provider/complete"
    }, 2000)
  }

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
            <Badge variant="secondary" className="mb-4">Step 5 of 5</Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Deploy Your First Agent</h1>
            <p className="text-lg text-muted-foreground">
              Create an AI agent to start earning by serving clients
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

          {/* Quick Start Templates */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Quick start templates</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {QUICK_START_TEMPLATES.map((template, idx) => (
                <Card
                  key={idx}
                  className="cursor-pointer transition-all hover:border-primary/50"
                  onClick={() => {
                    setAgentName(template.name)
                    setSelectedCategory(template.category)
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                      </div>
                      {template.popularity === "high" && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">{template.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Agent Creation Form */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Or create your own</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agent details</CardTitle>
                <CardDescription>Configure your agent&apos;s identity and capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Agent Name */}
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent name</Label>
                  <Input
                    id="agent-name"
                    placeholder="Enter a name for your agent"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-3">
                  <Label>Category</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {AGENT_CATEGORIES.map((category) => (
                      <Card
                        key={category.id}
                        className={`cursor-pointer transition-all ${
                          selectedCategory === category.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{category.icon}</span>
                            <div>
                              <h3 className="font-medium text-sm">{category.name}</h3>
                              <p className="text-xs text-muted-foreground">{category.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="space-y-3">
                  <Label>Capabilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {AGENT_CAPABILITIES.map((capability) => (
                      <Badge
                        key={capability}
                        variant={selectedCapabilities.includes(capability) ? "default" : "secondary"}
                        className={`cursor-pointer transition-all ${
                          selectedCapabilities.includes(capability)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary/20"
                        }`}
                        onClick={() => toggleCapability(capability)}
                      >
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4 w-full max-w-md">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleCreateAgent}
                disabled={!agentName || !selectedCategory || isCreating}
              >
                {isCreating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Create Agent
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/provider/complete" className="text-muted-foreground text-sm">
                <SkipForward className="mr-2 h-4 w-4" />
                Skip, I&apos;ll create agents later
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              You can always create agents later from the{" "}
              <Link href="/dashboard" className="underline-offset-4 hover:underline">
                Provider Dashboard
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}