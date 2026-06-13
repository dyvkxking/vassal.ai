'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Slider } from '@/components/ui/slider'
import { useAgentById } from '@/hooks/use-agents'
import { useSessions } from '@/hooks/use-sessions'
import type { Agent, Session } from '@/types'
import { toast } from 'sonner'

// Mock reviews data
const generateMockReviews = (agent: Agent) => [
  {
    id: 'rev-001',
    client: '0xClient...a1b2',
    rating: 5,
    text: 'Exceptional performance. The agent delivered accurate yield analysis within milliseconds. Highly recommended for DeFi protocols.',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'rev-002',
    client: '0xClient...c3d4',
    rating: 4,
    text: 'Solid analysis with good depth. Response times consistently met the SLA thresholds. Will rent again.',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'rev-003',
    client: '0xClient...e5f6',
    rating: 5,
    text: 'The wallet intelligence capabilities are impressive. Found several arbitrage opportunities thanks to the real-time alerts.',
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'rev-004',
    client: '0xClient...g7h8',
    rating: 4,
    text: 'Good overall. Minor delays during peak traffic periods but within acceptable bounds. Quality of insights is top-notch.',
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'rev-005',
    client: '0xClient...i9j0',
    rating: 5,
    text: 'Best agent in this category. The MEV detection accuracy is remarkable. Saved our protocol from multiple exploit attempts.',
    date: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
]

// Mock analytics data
const generateAnalyticsData = () => ({
  qualityScoreTrend: [
    { date: '2026-05-01', score: 91 },
    { date: '2026-05-08', score: 92 },
    { date: '2026-05-15', score: 90 },
    { date: '2026-05-22', score: 93 },
    { date: '2026-05-29', score: 94 },
    { date: '2026-06-03', score: 96 },
  ],
  tpmVsContracted: [
    { week: 'W1', contracted: 100000, actual: 78000 },
    { week: 'W2', contracted: 100000, actual: 85000 },
    { week: 'W3', contracted: 100000, actual: 92000 },
    { week: 'W4', contracted: 100000, actual: 88000 },
  ],
  latencyHeatmap: [
    ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    [
      { avg: 620, color: '#22c55e' },
      { avg: 580, color: '#22c55e' },
      { avg: 890, color: '#eab308' },
      { avg: 1200, color: '#f97316' },
      { avg: 980, color: '#eab308' },
      { avg: 720, color: '#22c55e' },
    ],
    [
      { avg: 640, color: '#22c55e' },
      { avg: 600, color: '#22c55e' },
      { avg: 920, color: '#eab308' },
      { avg: 1150, color: '#f97316' },
      { avg: 1020, color: '#eab308' },
      { avg: 750, color: '#22c55e' },
    ],
    [
      { avg: 610, color: '#22c55e' },
      { avg: 590, color: '#22c55e' },
      { avg: 870, color: '#eab308' },
      { avg: 1180, color: '#f97316' },
      { avg: 950, color: '#eab308' },
      { avg: 700, color: '#22c55e' },
    ],
  ],
  uptime: 99.4,
  completionRate: 97.8,
})

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function QualityScoreBadge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 95) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    if (s >= 85) return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    if (s >= 70) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    return 'bg-red-500/10 text-red-500 border-red-500/20'
  }

  return (
    <Badge variant="outline" className={`${getColor(score)} border font-medium`}>
      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {score}
    </Badge>
  )
}

function ASCIIChart({ data }: { data: { week: string; contracted: number; actual: number }[] }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.contracted, d.actual)))
  const height = 10

  const bars = data.map(d => {
    const contractedHeight = Math.round((d.contracted / maxVal) * height)
    const actualHeight = Math.round((d.actual / maxVal) * height)
    return { week: d.week, contractedHeight, actualHeight }
  })

  return (
    <div className="font-mono text-xs leading-none">
      <div className="text-muted-foreground mb-2">TPM: Contracted vs Actual</div>
      <div className="flex items-end gap-3">
        {bars.map((bar) => (
          <div key={bar.week} className="flex flex-col items-center gap-0.5">
            <div className="flex gap-0.5 items-end h-24">
              <div
                className="w-4 bg-blue-500/40"
                style={{ height: `${(bar.contractedHeight / height) * 100}%` }}
              />
              <div
                className="w-4 bg-emerald-500/60"
                style={{ height: `${(bar.actualHeight / height) * 100}%` }}
              />
            </div>
            <div className="text-muted-foreground">{bar.week}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500/40 inline-block" /> Contracted
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500/60 inline-block" /> Actual
        </span>
      </div>
    </div>
  )
}

function QualityLineChart({ data }: { data: { date: string; score: number }[] }) {
  const maxScore = 100
  const minScore = Math.min(...data.map(d => d.score)) - 2
  const range = maxScore - minScore

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = ((maxScore - d.score) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="font-mono text-xs">
      <div className="text-muted-foreground mb-2">Quality Score Trend</div>
      <svg viewBox="0 0 100 30" className="w-full h-20 text-emerald-500" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
        />
        <polyline
          fill="url(#lineGradient)"
          stroke="none"
          points={`0,100 ${points} 100,100`}
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = ((maxScore - d.score) / range) * 100
          return (
            <circle key={d.date} cx={x} cy={y} r="1.5" fill="currentColor" />
          )
        })}
      </svg>
      <div className="flex justify-between text-muted-foreground">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}

function LatencyHeatmap({ data }: { data: (string | { avg: number; color: string })[][] }) {
  return (
    <div className="font-mono text-xs">
      <div className="text-muted-foreground mb-2">Latency Heatmap (avg ms by hour)</div>
      <div className="grid grid-cols-6 gap-1">
        <div />
        {data[0].map((label) => (
          <div key={label as string} className="text-muted-foreground text-center">{label as string}</div>
        ))}
        {data.slice(1).map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="contents">
            <div className="text-muted-foreground flex items-center">
              Day {rowIdx + 1}
            </div>
            {row.map((cell, cellIdx) => {
              const { avg, color } = cell as { avg: number; color: string }
              return (
                <div
                  key={`cell-${rowIdx}-${cellIdx}`}
                  className="h-8 rounded flex items-center justify-center text-[10px] font-medium"
                  style={{ backgroundColor: color, color: avg > 1000 ? '#fff' : '#000' }}
                >
                  {avg}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2 text-muted-foreground">
        <span>Latency:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> &lt;700ms</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded" /> 700-1000ms</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded" /> &gt;1000ms</span>
      </div>
    </div>
  )
}

function MetricCard({ label, value, unit, description }: { label: string; value: string | number; unit?: string; description?: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold flex items-baseline gap-1">
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}
        </div>
        <div className="text-sm font-medium mt-1">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
      </CardContent>
    </Card>
  )
}

function RentalSheet({ agent, open, onOpenChange }: { agent: Agent; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [durationMinutes, setDurationMinutes] = useState(10)
  const [maxBudget, setMaxBudget] = useState(50)
  const [slaStrictness, setSlaStrictness] = useState(80)

  const estimatedCost = agent.pricing.type === 'per_minute'
    ? durationMinutes * (agent.pricing.pricePerMinute ?? 0)
    : agent.pricing.type === 'per_second'
    ? durationMinutes * 60 * (agent.pricing.pricePerSecond ?? 0)
    : 0

  const handleConfirmRental = () => {
    console.log('Confirming rental:', {
      agentId: agent.id,
      durationMinutes,
      maxBudget,
      slaStrictness,
      estimatedCost,
    })
    onOpenChange(false)
    toast.success('Rental request submitted', {
      description: `Session configured for ${durationMinutes} minutes.`,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Rent {agent.name}</SheetTitle>
          <SheetDescription>
            Configure your rental session parameters
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Duration */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[durationMinutes]}
                onValueChange={(v) => setDurationMinutes(Array.isArray(v) ? v[0] : v)}
                min={1}
                max={60}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-right font-mono text-sm">{durationMinutes}m</span>
            </div>
          </div>

          {/* Max Budget */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Max Budget (MESH)</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[maxBudget]}
                onValueChange={(v) => setMaxBudget(Array.isArray(v) ? v[0] : v)}
                min={1}
                max={200}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-right font-mono text-sm">{maxBudget}</span>
            </div>
          </div>

          {/* SLA Strictness */}
          <div className="space-y-3">
            <label className="text-sm font-medium">SLA Strictness (%)</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[slaStrictness]}
                onValueChange={(v) => setSlaStrictness(Array.isArray(v) ? v[0] : v)}
                min={50}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="w-12 text-right font-mono text-sm">{slaStrictness}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Higher strictness means more aggressive slashing on breaches
            </p>
          </div>

          <Separator />

          {/* Cost Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Duration</span>
              <span>{durationMinutes} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-mono">
                {agent.pricing.type === 'per_minute' && `$${agent.pricing.pricePerMinute}/min`}
                {agent.pricing.type === 'per_second' && `$${agent.pricing.pricePerSecond}/sec`}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Estimated Cost</span>
              <span className="font-mono">{estimatedCost.toFixed(4)} MESH</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleConfirmRental}>
            Confirm Rental
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string
  const { data: agent, isLoading, error } = useAgentById(agentId)
  const { data: sessionsData } = useSessions({ agentId })

  const [rentalSheetOpen, setRentalSheetOpen] = useState(false)

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Agent Not Found</CardTitle>
            <CardDescription>
              The agent you are looking for does not exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Link href="/browse-agents">Browse Agents</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const reviews = generateMockReviews(agent)
  const analyticsData = generateAnalyticsData()
  const agentSessions = sessionsData?.data ?? []

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleCompare = () => {
    console.log('Adding to compare:', agent.id)
    toast.info('Added to comparison tray')
  }

  const handleRentNow = () => {
    setRentalSheetOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="w-20 h-20 md:w-24 md:h-24 border-2 border-border">
              <AvatarImage src={agent.avatarUrl} />
              <AvatarFallback className="text-2xl">
                {agent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Agent Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">{agent.name}</h1>
                <Badge variant="outline" className="text-xs">
                  v{agent.version}
                </Badge>
                {agent.status === 'active' && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    Active
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {agent.creator}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{agent.totalSessions.toLocaleString()} sessions</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <StarRating rating={Math.round(agent.avgRating)} />
                  {agent.avgRating}
                </span>
              </div>

              <p className="text-sm text-muted-foreground max-w-2xl">{agent.description}</p>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex flex-col gap-2 min-w-[140px]">
              <Button onClick={handleRentNow}>Rent Now</Button>
              <Button variant="outline" size="sm" onClick={handleCompare}>
                Compare
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                Share
              </Button>
            </div>
          </div>

          {/* Quality Score & Category */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Quality:</span>
              <QualityScoreBadge score={agent.qualityScore} />
            </div>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="secondary" className="capitalize">
              {agent.category}
            </Badge>
            {agent.learningEnabled && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-500">
                  Learning Enabled
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="h-auto p-0 bg-transparent">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="capabilities" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Capabilities
                </TabsTrigger>
                <TabsTrigger value="pricing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Pricing
                </TabsTrigger>
                <TabsTrigger value="sla" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  SLA
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  History
                </TabsTrigger>
                <TabsTrigger value="skills" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Skills
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
                  </CardContent>
                </Card>

                {/* Skill Dependencies */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Dependencies</CardTitle>
                    <CardDescription>Skills required to run this agent</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {agent.skillDependencies.map((skillId) => (
                        <Badge
                          key={skillId}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                        >
                          {skillId}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Sessions</span>
                      <span className="font-semibold">{agent.totalSessions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Rating</span>
                      <span className="font-semibold flex items-center gap-1">
                        <StarRating rating={Math.round(agent.avgRating)} />
                        {agent.avgRating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="font-semibold">{new Date(agent.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span className="font-semibold">{new Date(agent.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Provider Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Provider</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Nodes Available</span>
                      <span className="font-semibold">
                        {sessionsData?.data?.length ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Uptime</span>
                      <span className="font-semibold">
                        99.4%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="capabilities" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Capabilities</CardTitle>
                <CardDescription>Technical capabilities of this agent</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">TPM Required</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agent.capabilities.map((cap) => (
                      <TableRow key={cap.id}>
                        <TableCell className="font-medium">{cap.name}</TableCell>
                        <TableCell className="text-muted-foreground">{cap.description}</TableCell>
                        <TableCell className="text-right font-mono">{cap.tpmRequired.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{cap.category}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant="outline" className="capitalize">{agent.pricing.type.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rate</span>
                    <span className="font-mono text-lg font-semibold">
                      {agent.pricing.type === 'per_minute' && `$${agent.pricing.pricePerMinute} / min`}
                      {agent.pricing.type === 'per_second' && `$${agent.pricing.pricePerSecond} / sec`}
                      {agent.pricing.type === 'flat_rate' && `$${agent.pricing.flatPrice} flat`}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example Costs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: '5 minutes', cost: agent.pricing.type === 'per_minute' ? 5 * (agent.pricing.pricePerMinute ?? 0) : 5 * 60 * (agent.pricing.pricePerSecond ?? 0) },
                    { label: '15 minutes', cost: agent.pricing.type === 'per_minute' ? 15 * (agent.pricing.pricePerMinute ?? 0) : 15 * 60 * (agent.pricing.pricePerSecond ?? 0) },
                    { label: '30 minutes', cost: agent.pricing.type === 'per_minute' ? 30 * (agent.pricing.pricePerMinute ?? 0) : 30 * 60 * (agent.pricing.pricePerSecond ?? 0) },
                    { label: '1 hour', cost: agent.pricing.type === 'per_minute' ? 60 * (agent.pricing.pricePerMinute ?? 0) : 60 * 60 * (agent.pricing.pricePerSecond ?? 0) },
                  ].map(({ label, cost }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="font-mono">{cost.toFixed(4)} MESH</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sla" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Latency Threshold"
                value={agent.slaParams.latencyThresholdMs}
                unit="ms"
                description="Max acceptable response time"
              />
              <MetricCard
                label="TPM Cap"
                value={agent.slaParams.tpmCap.toLocaleString()}
                description="Maximum tokens per minute"
              />
              <MetricCard
                label="Uptime Guarantee"
                value={agent.slaParams.uptimeGuaranteePercent}
                unit="%"
                description="Guaranteed availability"
              />
              <MetricCard
                label="Min Stake Required"
                value={agent.slaParams.minStakeRequired.toLocaleString()}
                unit="MESH"
                description="Minimum stake to provide service"
              />
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(agent.avgRating)} />
                    <span className="font-semibold">{agent.avgRating}</span>
                    <span className="text-muted-foreground">({reviews.length} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">{review.client}</span>
                        <StarRating rating={review.rating} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{review.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <QualityLineChart data={analyticsData.qualityScoreTrend} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <ASCIIChart data={analyticsData.tpmVsContracted} />
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <LatencyHeatmap data={analyticsData.latencyHeatmap} />
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Uptime"
                  value={analyticsData.uptime}
                  unit="%"
                />
                <MetricCard
                  label="Completion Rate"
                  value={analyticsData.completionRate}
                  unit="%"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Recent sessions for this agent</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentSessions.length > 0 ? agentSessions.map((session) => {
                      const duration = session.endTime
                        ? Math.round((session.endTime - session.startTime) / 60000)
                        : Math.round((Date.now() - session.startTime) / 60000)
                      return (
                        <TableRow key={session.id}>
                          <TableCell className="text-muted-foreground">
                            {new Date(session.startTime).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{session.client}</TableCell>
                          <TableCell>{duration}m</TableCell>
                          <TableCell className="text-right font-mono">{session.totalCost.toFixed(4)}</TableCell>
                          <TableCell>
                            {session.rating ? <StarRating rating={session.rating} /> : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={session.status === 'completed' ? 'default' : session.status === 'active' ? 'default' : 'secondary'}
                              className={
                                session.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                session.status === 'active' ? 'bg-blue-500/10 text-blue-500' : ''
                              }
                            >
                              {session.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    }) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No sessions yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                  <CardDescription>Skills that must be available to run this agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agent.skillDependencies.map((skillId) => (
                      <div key={skillId} className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="text-muted-foreground">{skillId}</span>
                        <Badge variant="outline">Required</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optional Skills</CardTitle>
                  <CardDescription>Skills that enhance agent performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    No optional skills
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Sticky Rent Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent md:hidden">
        <Button size="lg" className="w-full shadow-lg" onClick={handleRentNow}>
          Rent Now
        </Button>
      </div>

      {/* Rental Sheet */}
      <RentalSheet
        agent={agent}
        open={rentalSheetOpen}
        onOpenChange={setRentalSheetOpen}
      />
    </div>
  )
}