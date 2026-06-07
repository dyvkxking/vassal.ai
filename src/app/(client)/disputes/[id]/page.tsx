'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// Mock dispute data
interface TimelineEvent {
  date: number
  title: string
  description: string
  type: 'opened' | 'review' | 'resolved'
}

interface Evidence {
  id: string
  name: string
  type: string
  uploadedAt: number
}

const MOCK_DISPUTE = {
  id: 'disp-001',
  date: Date.now() - 604800000,
  agentName: 'MEV Detector',
  amount: 0.056,
  status: 'open' as 'open' | 'resolved' | 'rejected' | 'appealed',
  reason: 'SLA breach not refunded',
  description: 'Agent returned incorrect data output causing transaction to revert. Should have been refunded under SLA.',
  timeline: [
    {
      date: Date.now() - 604800000,
      title: 'Dispute Opened',
      description: 'You submitted a dispute claim for this transaction.',
      type: 'opened' as const,
    },
    {
      date: Date.now() - 518400000,
      title: 'Under Review',
      description: 'Our team is investigating the claim and reviewing evidence.',
      type: 'review' as const,
    },
    {
      date: Date.now() - 432000000,
      title: 'Resolved - Refund Approved',
      description: 'Claim approved. Refund of $0.056 has been processed.',
      type: 'resolved' as const,
    },
  ] as TimelineEvent[],
  evidence: [
    { id: 'ev-001', name: 'session_logs.txt', type: 'text/plain', uploadedAt: Date.now() - 604800000 },
    { id: 'ev-002', name: 'tx_revert_proof.png', type: 'image/png', uploadedAt: Date.now() - 518400000 },
  ] as Evidence[],
  resolution: 'Full refund of $0.056 approved due to SLA breach - latency exceeded threshold.',
  canAppeal: false,
}

export default function DisputeDetailPage({ params }: { params: { id: string } }) {
  const [showAppealForm, setShowAppealForm] = useState(false)
  const [appealReason, setAppealReason] = useState('')
  const dispute = MOCK_DISPUTE // In real app: fetch by params.id

  const handleAppeal = () => {
    // Handle appeal submission
    setShowAppealForm(false)
    setAppealReason('')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Dispute Details</h1>
              <Badge variant="outline" className="font-mono">{dispute.id}</Badge>
            </div>
            <p className="text-muted-foreground">
              Review dispute information, evidence, and resolution.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Dispute Info */}
          <Card>
            <CardHeader>
              <CardTitle>Dispute Information</CardTitle>
              <CardDescription>Details about this dispute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Agent</span>
                <span className="font-medium">{dispute.agentName}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Date Filed</span>
                <span className="font-mono text-sm">
                  {new Date(dispute.date).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Amount in Dispute</span>
                <span className="text-xl font-bold">${dispute.amount.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    dispute.status === 'resolved' && 'bg-green-100 text-green-700',
                    dispute.status === 'open' && 'bg-yellow-100 text-yellow-700',
                    dispute.status === 'rejected' && 'bg-red-100 text-red-700',
                    dispute.status === 'appealed' && 'bg-purple-100 text-purple-700'
                  )}
                >
                  {dispute.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Reason & Description */}
          <Card>
            <CardHeader>
              <CardTitle>Reason & Description</CardTitle>
              <CardDescription>Why this dispute was filed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Reason</span>
                <Badge variant="outline">{dispute.reason}</Badge>
              </div>
              <Separator />
              <div className="py-3">
                <span className="text-muted-foreground block mb-2">Description</span>
                <p className="text-sm bg-muted/50 p-4 rounded-lg">{dispute.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Submitted */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence Submitted</CardTitle>
              <CardDescription>Files and documents supporting your claim</CardDescription>
            </CardHeader>
            <CardContent>
              {dispute.evidence.length > 0 ? (
                <div className="space-y-3">
                  {dispute.evidence.map((evidence) => (
                    <div key={evidence.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">{evidence.name}</p>
                          <p className="text-sm text-muted-foreground">{evidence.type}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(evidence.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No evidence submitted
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Dispute Timeline</CardTitle>
              <CardDescription>Chronological history of this dispute</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-muted" />
                {dispute.timeline.map((event, index) => (
                  <div key={index} className="relative flex items-start gap-4 pl-10">
                    <div
                      className={cn(
                        'absolute left-2 w-4 h-4 rounded-full border-2 bg-background',
                        event.type === 'opened' && 'border-yellow-500 bg-yellow-500',
                        event.type === 'review' && 'border-blue-500 bg-blue-500',
                        event.type === 'resolved' && 'border-green-500 bg-green-500'
                      )}
                    />
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resolution Outcome */}
          {dispute.status === 'resolved' || dispute.status === 'rejected' ? (
            <Card className={cn(
              dispute.status === 'resolved' ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
            )}>
              <CardHeader>
                <CardTitle className={dispute.status === 'resolved' ? 'text-green-700' : 'text-red-700'}>
                  Resolution Outcome
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-background/80">
                  <p className="text-sm">{dispute.resolution}</p>
                </div>
                {dispute.canAppeal && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setShowAppealForm(true)}>
                      Appeal Decision
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Appeal Form */}
          {showAppealForm && (
            <Card>
              <CardHeader>
                <CardTitle>Appeal This Decision</CardTitle>
                <CardDescription>Provide additional information for reconsideration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Explain why you believe this decision should be reconsidered..."
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAppealForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAppeal} disabled={!appealReason}>
                    Submit Appeal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}