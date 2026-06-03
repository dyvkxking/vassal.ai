'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

// Mock session data
const MOCK_SESSION = {
  id: 'sess-abc123xyz',
  agentId: 'agent-001',
  agentName: 'DeFi Yield Oracle',
  agentAvatar: null,
  client: '0x742d35Cc6634C0532925a3b844Bc9e7595f',
  startTime: Date.now() - 1000 * 60 * 12, // started 12 minutes ago
  contractedTpmCap: 100000,
  currentTpm: 84750,
  latencyThresholdMs: 1200,
  currentLatencyMs: 890,
  slaStrictness: 85,
  maxBudget: 50,
  currentCost: 0.0234,
  heartbeatCount: 14,
  status: 'active' as const,
}

// Mock event log
const INITIAL_EVENTS = [
  { id: '1', timestamp: Date.now() - 1000 * 60 * 11, type: 'heartbeat', message: 'Heartbeat #1 OK' },
  { id: '2', timestamp: Date.now() - 1000 * 60 * 9, type: 'info', message: 'Session started with SLA strictness 85%' },
  { id: '3', timestamp: Date.now() - 1000 * 60 * 8, type: 'heartbeat', message: 'Heartbeat #5 OK' },
  { id: '4', timestamp: Date.now() - 1000 * 60 * 6, type: 'warning', message: 'TPM spike detected: 85K (approaching cap)' },
  { id: '5', timestamp: Date.now() - 1000 * 60 * 4, type: 'heartbeat', message: 'Heartbeat #9 OK' },
  { id: '6', timestamp: Date.now() - 1000 * 60 * 2, type: 'warning', message: 'SLA warning: latency approaching threshold' },
  { id: '7', timestamp: Date.now() - 1000 * 60 * 1, type: 'heartbeat', message: 'Heartbeat #12 OK' },
  { id: '8', timestamp: Date.now() - 1000 * 30, type: 'info', message: 'Cost projection updated' },
]

// Mock chat messages
const INITIAL_MESSAGES = [
  { id: '1', role: 'agent' as const, content: 'Session initialized. Monitoring DeFi yield opportunities across Uniswap V3 and Aave.', timestamp: Date.now() - 1000 * 60 * 11 },
  { id: '2', role: 'user' as const, content: 'Check arbitrage opportunities between WETH/USDC and WBTC/USDC pools', timestamp: Date.now() - 1000 * 60 * 9 },
  { id: '3', role: 'agent' as const, content: 'Analyzing cross-pool arbitrage potential. Current gas costs favor trades above $50 profit threshold.', timestamp: Date.now() - 1000 * 60 * 8 },
  { id: '4', role: 'user' as const, content: 'Alert me if yield drops below 4.5% APY on any monitored pool', timestamp: Date.now() - 1000 * 60 * 5 },
  { id: '5', role: 'agent' as const, content: 'Alert configured for yield threshold 4.5% APY. Currently monitoring 12 pools.', timestamp: Date.now() - 1000 * 60 * 4 },
]

function formatElapsedTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleTimeString('en-US', { hour12: false })
}

function getEventColor(type: string): string {
  switch (type) {
    case 'heartbeat': return 'text-emerald-500'
    case 'warning': return 'text-yellow-500'
    case 'error': return 'text-red-500'
    default: return 'text-muted-foreground'
  }
}

function getEventIcon(type: string): string {
  switch (type) {
    case 'heartbeat': return '●'
    case 'warning': return '▲'
    case 'error': return '■'
    default: return '○'
  }
}

function SLAHealthBar({ currentLatency, threshold }: { currentLatency: number; threshold: number }) {
  const percentage = Math.min((currentLatency / threshold) * 100, 100)
  const getColor = () => {
    if (percentage < 50) return 'bg-emerald-500'
    if (percentage < 75) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">SLA Health</span>
        <span className="text-muted-foreground font-mono">
          {currentLatency}ms / {threshold}ms
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={`text-xs ${
            percentage < 50 ? 'border-emerald-500/30 text-emerald-500' :
            percentage < 75 ? 'border-yellow-500/30 text-yellow-500' :
            'border-red-500/30 text-red-500'
          }`}
        >
          {percentage < 50 ? 'Healthy' : percentage < 75 ? 'Warning' : 'Critical'}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {percentage.toFixed(0)}% of threshold
        </span>
      </div>
    </div>
  )
}

function HeartbeatIndicator({ count, healthy }: { count: number; healthy: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative w-3 h-3 ${healthy ? 'text-emerald-500' : 'text-red-500'}`}>
        <span
          className={`absolute inset-0 rounded-full ${
            healthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
          }`}
        />
        <span className="absolute inset-0 rounded-full opacity-75 animate-ping">
          {healthy && <span className="absolute inset-0 rounded-full bg-emerald-500" />}
        </span>
      </div>
      <span className={`text-sm font-medium ${healthy ? 'text-emerald-500' : 'text-red-500'}`}>
        {healthy ? 'Connected' : 'Disconnected'}
      </span>
      <span className="text-xs text-muted-foreground">HB #{count}</span>
    </div>
  )
}

function MetricCard({ label, value, unit, sublabel }: { label: string; value: string | number; unit?: string; sublabel?: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold font-mono">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {sublabel && <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>}
      </CardContent>
    </Card>
  )
}

function TPMProgress({ current, cap }: { current: number; cap: number }) {
  const percentage = (current / cap) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">TPM Usage</span>
        <span className="text-sm font-mono text-muted-foreground">
          {current.toLocaleString()} / {cap.toLocaleString()}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{percentage.toFixed(1)}% utilized</span>
        {percentage > 80 && (
          <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-500">
            Approaching cap
          </Badge>
        )}
      </div>
    </div>
  )
}

function EventLog({ events }: { events: { id: string; timestamp: number; type: string; message: string }[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Session Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] px-4 pb-4">
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-2 text-sm">
                <span className={`font-mono text-xs mt-0.5 ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </span>
                <span className="text-muted-foreground font-mono text-xs w-16 shrink-0">
                  {formatTimestamp(event.timestamp)}
                </span>
                <span className={getEventColor(event.type)}>{event.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function ChatFeed({ messages }: { messages: { id: string; role: string; content: string; timestamp: number }[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Interaction Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] px-4 pb-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-70">
                      {msg.role === 'user' ? 'You' : 'Agent'}
                    </span>
                    <span className="text-xs opacity-50">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function SessionControls({
  onExtend,
  onAdjustSLA,
  onTerminate,
  onReport,
}: {
  onExtend: () => void
  onAdjustSLA: () => void
  onTerminate: () => void
  onReport: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Session Controls</CardTitle>
        <CardDescription>Manage your active session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full" onClick={onExtend}>
          Extend Session
        </Button>
        <Button variant="outline" className="w-full" onClick={onAdjustSLA}>
          Adjust SLA
        </Button>
        <Separator />
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive" className="w-full">
              Terminate Session
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Terminate Session?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately end the session and stop all agent activity.
                You will be charged for the current usage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onTerminate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Terminate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="ghost" className="w-full text-muted-foreground" onClick={onReport}>
          Report Agent
        </Button>
      </CardContent>
    </Card>
  )
}

function CostProjection({ currentCost, elapsedMs, maxBudget }: { currentCost: number; elapsedMs: number; maxBudget: number }) {
  const ratePerMs = currentCost / elapsedMs
  const projectedCost30min = ratePerMs * 30 * 60 * 1000
  const projectedCost60min = ratePerMs * 60 * 60 * 1000

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Cost Projection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Cost</span>
          <span className="text-xl font-bold font-mono">{currentCost.toFixed(4)} MESH</span>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Projected (30 min)</span>
            <span className="font-mono">{projectedCost30min.toFixed(4)} MESH</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Projected (60 min)</span>
            <span className="font-mono">{projectedCost60min.toFixed(4)} MESH</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Max Budget</span>
            <span className="font-mono">{maxBudget} MESH</span>
          </div>
        </div>
        <Progress value={(currentCost / maxBudget) * 100} className="h-2" />
        <div className="text-xs text-muted-foreground text-center">
          {((currentCost / maxBudget) * 100).toFixed(1)}% of budget consumed
        </div>
      </CardContent>
    </Card>
  )
}

export default function ActiveSessionPage() {
  const params = useParams()
  const sessionId = params.id as string

  const [elapsedMs, setElapsedMs] = useState(Date.now() - MOCK_SESSION.startTime)
  const [currentTpm, setCurrentTpm] = useState(MOCK_SESSION.currentTpm)
  const [currentLatency, setCurrentLatency] = useState(MOCK_SESSION.currentLatencyMs)
  const [currentCost, setCurrentCost] = useState(MOCK_SESSION.currentCost)
  const [events] = useState(INITIAL_EVENTS)
  const [messages] = useState(INITIAL_MESSAGES)
  const [heartbeatCount, setHeartbeatCount] = useState(MOCK_SESSION.heartbeatCount)

  // Live timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - MOCK_SESSION.startTime)

      // Simulate cost accumulation (random rate between 0.0001 and 0.0003 per second)
      setCurrentCost(prev => prev + (0.0001 + Math.random() * 0.0002))

      // Simulate latency fluctuation
      setCurrentLatency(prev => {
        const delta = (Math.random() - 0.5) * 50
        return Math.max(600, Math.min(1500, prev + delta))
      })

      // Simulate TPM fluctuation
      setCurrentTpm(prev => {
        const delta = (Math.random() - 0.5) * 5000
        return Math.max(50000, Math.min(95000, prev + delta))
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate heartbeat increment
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeatCount(prev => prev + 1)
    }, 55000) // heartbeat every ~55 seconds

    return () => clearInterval(interval)
  }, [])

  const handleExtend = useCallback(() => {
    toast.success('Session extension requested', {
      description: 'Additional 30 minutes added to your session.',
    })
  }, [])

  const handleAdjustSLA = useCallback(() => {
    toast.info('SLA adjustment panel', {
      description: 'Configure your SLA parameters.',
    })
  }, [])

  const handleTerminate = useCallback(() => {
    toast.success('Session terminated', {
      description: 'Your session has been ended successfully.',
    })
  }, [])

  const handleReport = useCallback(() => {
    toast.warning('Report submitted', {
      description: 'Thank you for your feedback. We will investigate.',
    })
  }, [])

  const slaHealthPercentage = (currentLatency / MOCK_SESSION.latencyThresholdMs) * 100
  const isHealthy = slaHealthPercentage < 60
  const isConnected = heartbeatCount > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <Link href="/client/dashboard">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Agent Avatar */}
            <Avatar className="w-16 h-16 border-2 border-border">
              {MOCK_SESSION.agentAvatar && <AvatarImage src={MOCK_SESSION.agentAvatar} />}
              <AvatarFallback className="text-xl">
                {MOCK_SESSION.agentName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Session Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">Session {sessionId}</h1>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Active
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {MOCK_SESSION.agentName}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Started {new Date(MOCK_SESSION.startTime).toLocaleTimeString()}
                </span>
              </div>

              {/* Elapsed Timer */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Elapsed:</span>
                <span className="text-2xl font-mono font-bold tracking-wider">
                  {formatElapsedTime(elapsedMs)}
                </span>
              </div>
            </div>

            {/* Heartbeat Status */}
            <div className="flex-shrink-0">
              <HeartbeatIndicator count={heartbeatCount} healthy={isConnected} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Metrics and Feeds */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real-time Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">TPM Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TPMProgress current={Math.round(currentTpm)} cap={MOCK_SESSION.contractedTpmCap} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Latency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono">
                      {Math.round(currentLatency)}
                    </span>
                    <span className="text-sm text-muted-foreground">ms</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        currentLatency < 700 ? 'border-emerald-500/30 text-emerald-500' :
                        currentLatency < 1200 ? 'border-yellow-500/30 text-yellow-500' :
                        'border-red-500/30 text-red-500'
                      }`}
                    >
                      {currentLatency < 700 ? 'Optimal' : currentLatency < 1200 ? 'Acceptable' : 'High'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cost Accumulator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono">
                      {currentCost.toFixed(4)}
                    </span>
                    <span className="text-sm text-muted-foreground">MESH</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Rate: ~{(currentCost / (elapsedMs / 1000) * 60).toFixed(4)}/min
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SLA Health Bar */}
            <Card>
              <CardContent className="pt-6">
                <SLAHealthBar
                  currentLatency={Math.round(currentLatency)}
                  threshold={MOCK_SESSION.latencyThresholdMs}
                />
              </CardContent>
            </Card>

            {/* Timeline and Chat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EventLog events={events} />
              <ChatFeed messages={messages} />
            </div>
          </div>

          {/* Right Sidebar - Controls and Projection */}
          <div className="space-y-6">
            <CostProjection
              currentCost={currentCost}
              elapsedMs={elapsedMs}
              maxBudget={MOCK_SESSION.maxBudget}
            />

            <SessionControls
              onExtend={handleExtend}
              onAdjustSLA={handleAdjustSLA}
              onTerminate={handleTerminate}
              onReport={handleReport}
            />

            {/* Session Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Session ID</span>
                  <span className="font-mono text-xs">{sessionId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contracted TPM Cap</span>
                  <span className="font-mono">{MOCK_SESSION.contractedTpmCap.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Latency Threshold</span>
                  <span className="font-mono">{MOCK_SESSION.latencyThresholdMs}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SLA Strictness</span>
                  <span className="font-mono">{MOCK_SESSION.slaStrictness}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-mono text-xs">{MOCK_SESSION.client.slice(0, 10)}...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}