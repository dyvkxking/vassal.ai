'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

// Mock session data (same as in parent page)
const MOCK_SESSION = {
  id: 'sess-abc123xyz',
  agentId: 'agent-001',
  agentName: 'DeFi Yield Oracle',
  agentAvatar: null,
  client: '0x742d35Cc6634C0532925a3b844Bc9e7595f',
  startTime: Date.now() - 1000 * 60 * 12,
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

export default function ExtendSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [elapsedMs, setElapsedMs] = useState(Date.now() - MOCK_SESSION.startTime)
  const [currentCost, setCurrentCost] = useState(MOCK_SESSION.currentCost)
  const [duration, setDuration] = useState('30')
  const [additionalBudget, setAdditionalBudget] = useState('')
  const [slaStrictness, setSLAStrictness] = useState(MOCK_SESSION.slaStrictness)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Live timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - MOCK_SESSION.startTime)
      setCurrentCost(prev => prev + (0.0001 + Math.random() * 0.0002))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const durationMinutes = parseInt(duration) || 0
  const additionalCost = (currentCost / (elapsedMs / 1000)) * durationMinutes * 60

  const handleConfirm = () => {
    setConfirmOpen(false)
    toast.success('Session extended', {
      description: `Added ${durationMinutes} minutes to your session.`,
    })
    router.push(`/active-session/${sessionId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <Link href={`/active-session/${sessionId}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Session
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar className="w-16 h-16 border-2 border-border">
              {MOCK_SESSION.agentAvatar && <AvatarImage src={MOCK_SESSION.agentAvatar} />}
              <AvatarFallback className="text-xl">
                {MOCK_SESSION.agentName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">Extend Session</h1>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Active
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  {MOCK_SESSION.agentName}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1 font-mono">
                  {sessionId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Elapsed:</span>
                <span className="text-2xl font-mono font-bold tracking-wider">
                  {formatElapsedTime(elapsedMs)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Current Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Session ID</span>
                <span className="font-mono text-xs">{sessionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Agent</span>
                <span className="font-medium">{MOCK_SESSION.agentName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Elapsed Time</span>
                <span className="font-mono">{formatElapsedTime(elapsedMs)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Cost</span>
                <span className="font-mono">{currentCost.toFixed(4)} MESH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SLA Strictness</span>
                <span className="font-mono">{MOCK_SESSION.slaStrictness}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Extension Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Extension Options</CardTitle>
              <CardDescription>Configure your session extension</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Budget (MESH)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={additionalBudget}
                  onChange={(e) => setAdditionalBudget(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep current budget
                </p>
              </div>

              <div className="space-y-2">
                <Label>SLA Strictness</Label>
                <Select value={String(slaStrictness)} onValueChange={(v) => setSLAStrictness(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">Relaxed (50%)</SelectItem>
                    <SelectItem value="65">Moderate (65%)</SelectItem>
                    <SelectItem value="80">Strict (80%)</SelectItem>
                    <SelectItem value="100">Maximum (100%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cost Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current session cost</span>
                <span className="font-mono">{currentCost.toFixed(4)} MESH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Additional cost ({durationMinutes} min)</span>
                <span className="font-mono text-emerald-500">+{additionalCost.toFixed(4)} MESH</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>Total projected</span>
                <span className="font-mono">{(currentCost + additionalCost).toFixed(4)} MESH</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Max budget</span>
                  <span>{MOCK_SESSION.maxBudget} MESH</span>
                </div>
                <Progress value={((currentCost + additionalCost) / MOCK_SESSION.maxBudget) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {(((currentCost + additionalCost) / MOCK_SESSION.maxBudget) * 100).toFixed(1)}% of max budget
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Confirm Action */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.push(`/active-session/${sessionId}`)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => setConfirmOpen(true)}>
              Confirm Extension
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction Confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Session Extension</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to extend your session by {durationMinutes} minutes with an additional cost of approximately {additionalCost.toFixed(4)} MESH.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New duration</span>
              <span className="font-mono">{durationMinutes} minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Additional cost</span>
              <span className="font-mono text-emerald-500">+{additionalCost.toFixed(4)} MESH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SLA strictness</span>
              <span className="font-mono">{slaStrictness}%</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm & Extend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}