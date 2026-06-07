'use client'

import { useState } from 'react'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

// Mock session history data
const MOCK_SESSION_HISTORY = {
  id: 'sess-abc123xyz',
  agentId: 'agent-001',
  agentName: 'DeFi Yield Oracle',
  agentAvatar: null,
  client: '0x742d35Cc6634C0532925a3b844Bc9e7595f',
  startTime: Date.now() - 1000 * 60 * 45, // started 45 minutes ago
  endTime: Date.now(),
  duration: 1000 * 60 * 45,
  contractedTpmCap: 100000,
  totalTpmUsed: 4850000,
  latencyThresholdMs: 1200,
  avgLatencyMs: 980,
  slaStrictness: 85,
  maxBudget: 50,
  totalCost: 12.847,
  baseCost: 11.200,
  slaPenalties: 1.647,
  refund: 0,
  slaCompliance: 'passed' as const,
  heartbeatCount: 52,
  rating: 4,
  feedback: 'Great agent performance, found excellent yield opportunities.',
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function SessionReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const session = MOCK_SESSION_HISTORY

  const handleDownloadPDF = () => {
    toast.success('Receipt downloaded', {
      description: 'PDF receipt has been downloaded.',
    })
  }

  const handleDownloadJSON = () => {
    const receiptData = {
      sessionId: session.id,
      agent: session.agentName,
      date: new Date(session.startTime).toISOString(),
      duration: session.duration,
      totalCost: session.totalCost,
      slaCompliance: session.slaCompliance,
      lineItems: [
        { description: 'Base session cost', amount: session.baseCost },
        { description: 'SLA penalties', amount: session.slaPenalties },
        { description: 'Refunds', amount: -session.refund },
      ],
      rating: session.rating,
      feedback: session.feedback,
    }

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${sessionId}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Receipt downloaded', {
      description: 'JSON receipt has been downloaded.',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <Link href="/session-history">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to History
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar className="w-16 h-16 border-2 border-border">
              {session.agentAvatar && <AvatarImage src={session.agentAvatar} />}
              <AvatarFallback className="text-xl">
                {session.agentName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">Session Receipt</h1>
                <Badge className="bg-muted text-muted-foreground border-0">
                  Completed
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  {session.agentName}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1 font-mono">
                  {sessionId}
                </span>
              </div>

              <div className="text-sm text-muted-foreground">
                {formatDate(session.startTime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Session Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="text-xl font-bold font-mono">{formatDuration(session.duration)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                  <div className="text-xl font-bold font-mono">{session.totalCost.toFixed(4)} MESH</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">TPM Used</div>
                  <div className="text-xl font-bold font-mono">{(session.totalTpmUsed / 1000000).toFixed(2)}M</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Avg Latency</div>
                  <div className="text-xl font-bold font-mono">{session.avgLatencyMs}ms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLA Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SLA Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  session.slaCompliance === 'passed'
                    ? 'bg-emerald-500/10'
                    : 'bg-red-500/10'
                }`}>
                  {session.slaCompliance === 'passed' ? (
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${
                      session.slaCompliance === 'passed' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {session.slaCompliance === 'passed' ? 'SLA Passed' : 'SLA Failed'}
                    </span>
                    <Badge variant={session.slaCompliance === 'passed' ? 'default' : 'destructive'}>
                      {session.slaCompliance === 'passed' ? 'Compliant' : 'Breach'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {session.slaCompliance === 'passed'
                      ? `Average latency ${session.avgLatencyMs}ms within threshold ${session.latencyThresholdMs}ms at ${session.slaStrictness}% strictness`
                      : `Average latency exceeded threshold at ${session.slaStrictness}% strictness level`
                    }
                  </p>
                </div>
              </div>

              {session.refund > 0 && (
                <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-500">Refund Applied</span>
                    <span className="text-lg font-bold font-mono text-emerald-500">-{session.refund.toFixed(4)} MESH</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    SLA breach penalty refunded due to service interruption
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Base Session Cost</TableCell>
                    <TableCell className="text-right font-mono">{session.baseCost.toFixed(4)} MESH</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">
                      SLA Penalties
                      <span className="text-xs ml-2">(latency overages at {session.slaStrictness}% strictness)</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-yellow-500">+{session.slaPenalties.toFixed(4)} MESH</TableCell>
                  </TableRow>
                  {session.refund > 0 && (
                    <TableRow>
                      <TableCell className="font-medium text-emerald-500">SLA Breach Refund</TableCell>
                      <TableCell className="text-right font-mono text-emerald-500">-{session.refund.toFixed(4)} MESH</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold font-mono">{session.totalCost.toFixed(4)} MESH</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Rating & Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rating & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Your Rating</div>
                  <StarRating rating={session.rating} />
                </div>
              </div>

              {session.feedback && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Your Feedback</div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm">{session.feedback}</p>
                  </div>
                </div>
              )}

              {!session.feedback && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Add Feedback</div>
                  <textarea
                    className="w-full bg-muted rounded-lg p-4 text-sm min-h-[100px] resize-none"
                    placeholder="Share your experience with this session..."
                  />
                  <Button size="sm">Submit Feedback</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Download Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Download Receipt</CardTitle>
              <CardDescription>
                Get a copy of your session receipt for your records
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleDownloadPDF}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleDownloadJSON}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Download JSON
              </Button>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Session ID</span>
                <span className="font-mono text-xs">{session.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Agent</span>
                <span className="font-medium">{session.agentName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Start Time</span>
                <span className="font-mono text-xs">{formatDate(session.startTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">End Time</span>
                <span className="font-mono text-xs">{formatDate(session.endTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contracted TPM Cap</span>
                <span className="font-mono">{session.contractedTpmCap.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total TPM Used</span>
                <span className="font-mono">{session.totalTpmUsed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Latency Threshold</span>
                <span className="font-mono">{session.latencyThresholdMs}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Heartbeats</span>
                <span className="font-mono">{session.heartbeatCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SLA Strictness</span>
                <span className="font-mono">{session.slaStrictness}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client</span>
                <span className="font-mono text-xs">{session.client.slice(0, 10)}...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}