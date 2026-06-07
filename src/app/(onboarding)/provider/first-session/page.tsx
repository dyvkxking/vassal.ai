"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Zap, Server, Activity, Clock, ArrowRight, Loader2 } from 'lucide-react'
import Link from "next/link"

const STEPS = [
  { number: 1, label: "Connect Wallet", icon: CheckCircle2, status: "completed" },
  { number: 2, label: "Stake Setup", icon: CheckCircle2, status: "completed" },
  { number: 3, label: "CLI Install", icon: CheckCircle2, status: "completed" },
  { number: 4, label: "First Session", icon: CheckCircle2, status: "current" },
  { number: 5, label: "Create Agent", icon: Circle, status: "pending" },
]

const SESSION_STATES = [
  { label: "Pending", description: "Waiting for tasks", icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
  { label: "Active", description: "Processing requests", icon: Activity, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { label: "Completed", description: "Task finished", icon: CheckCircle2, color: "text-violet-600", bgColor: "bg-violet-50" },
]

const SAMPLE_SESSION_FLOW = [
  { step: 1, title: "Task Request", description: "Client submits agent task", time: "0s" },
  { step: 2, title: "Task Assignment", description: "Task assigned to your node", time: "2s" },
  { step: 3, title: "Execution", description: "Your node processes the task", time: "5s" },
  { step: 4, title: "Result", description: "Result sent back to client", time: "7s" },
]

const HOW_SESSIONS_WORK = [
  {
    icon: Server,
    title: "Node Discovery",
    description: "Your node advertises its capabilities to the Somnia network. Providers with higher stake and better uptime get prioritized for task allocation.",
  },
  {
    icon: Zap,
    title: "Task Assignment",
    description: "When a client requests an agent, the network matches them with an appropriate provider node based on requirements and reputation.",
  },
  {
    icon: Activity,
    title: "Execution & Monitoring",
    description: "Your node executes the assigned task while the network monitors performance. Slashing rules apply for failures or downtime.",
  },
  {
    icon: Circle,
    title: "Reward Distribution",
    description: "Upon successful completion, rewards are automatically transferred to your connected wallet in $MESH tokens.",
  },
]

export default function FirstSessionPage() {
  const [nodeStatus, setNodeStatus] = useState<"checking" | "pending" | "active">("checking")
  const [sessionProgress, setSessionProgress] = useState(0)

  const checkNodeStatus = () => {
    setNodeStatus("checking")
    setTimeout(() => {
      setNodeStatus("pending")
      setTimeout(() => {
        setNodeStatus("active")
        setSessionProgress(100)
      }, 3000)
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
            <Badge variant="secondary" className="mb-4">Step 4 of 5</Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Start Your First Session</h1>
            <p className="text-lg text-muted-foreground">
              Learn how sessions work and bring your node online
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

          {/* How Sessions Work */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">How sessions work</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {HOW_SESSIONS_WORK.map((item, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Node Status Check */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Node status check</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        nodeStatus === "active"
                          ? "bg-emerald-500 animate-pulse"
                          : nodeStatus === "pending"
                          ? "bg-amber-500 animate-pulse"
                          : "bg-muted"
                      }`}
                    />
                    <CardTitle className="text-base">
                      {nodeStatus === "checking" && "Checking node status..."}
                      {nodeStatus === "pending" && "Node pending activation"}
                      {nodeStatus === "active" && "Node is active"}
                    </CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkNodeStatus}
                    disabled={nodeStatus !== "checking"}
                  >
                    {nodeStatus === "checking" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Re-check"
                    )}
                  </Button>
                </div>
                <Progress value={nodeStatus === "active" ? 100 : nodeStatus === "pending" ? 50 : 0} className="mt-3" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {SESSION_STATES.map((state, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${state.bgColor} ${
                        (state.label === "Active" && nodeStatus === "active") ||
                        (state.label === "Pending" && nodeStatus === "pending")
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      <state.icon className={`h-4 w-4 ${state.color}`} />
                      <span className="text-sm font-medium">{state.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Session Flow */}
          <div className="mb-8">
            <h2 className="mb-4 text-center text-lg font-medium">Sample session flow</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-4">
                    {SAMPLE_SESSION_FLOW.map((item, idx) => (
                      <div key={idx} className="relative flex items-start gap-4 pl-10">
                        <div className="absolute left-2.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">{item.title}</h3>
                            <Badge variant="secondary" className="text-xs">{item.time}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complete Setup CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="w-full max-w-md"
              disabled={nodeStatus !== "active"}
            >
              {nodeStatus === "active" ? (
                <>
                  Complete Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
            {nodeStatus !== "active" && (
              <p className="text-xs text-muted-foreground">
                Complete the node status check to continue
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}