'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Mock data types
interface Refund {
  id: string
  date: number
  agentName: string
  amount: number
  originalAmount: number
  reason: string
  slaBreach: string
  type: 'sla_breach' | 'dispute_resolved' | 'billing_error'
}

const MOCK_REFUNDS: Refund[] = [
  {
    id: 'ref-001',
    date: Date.now() - 345600000,
    agentName: 'NFT Collection Analyzer',
    amount: 0.031,
    originalAmount: 0.031,
    reason: 'Dispute resolved in your favor',
    slaBreach: 'Latency breach (2500ms > 2000ms threshold)',
    type: 'sla_breach',
  },
  {
    id: 'ref-002',
    date: Date.now() - 86400000,
    agentName: 'MEV Detector',
    amount: 0.056,
    originalAmount: 0.056,
    reason: 'SLA breach - incorrect data output',
    slaBreach: 'Data quality SLA violation',
    type: 'sla_breach',
  },
  {
    id: 'ref-003',
    date: Date.now() - 172800000,
    agentName: 'Token Price Oracle',
    amount: 0.023,
    originalAmount: 0.045,
    reason: 'Partial refund - service degradation',
    slaBreach: 'Stale data (5min delay)',
    type: 'sla_breach',
  },
]

function RefundTypeBadge({ type }: { type: Refund['type'] }) {
  const styles: Record<string, string> = {
    sla_breach: 'bg-red-100 text-red-700',
    dispute_resolved: 'bg-green-100 text-green-700',
    billing_error: 'bg-blue-100 text-blue-700',
  }
  const labels: Record<string, string> = {
    sla_breach: 'SLA Breach',
    dispute_resolved: 'Dispute Won',
    billing_error: 'Billing Error',
  }
  return (
    <Badge variant="secondary" className={cn(styles[type])}>
      {labels[type]}
    </Badge>
  )
}

function ExplanationCard({ refund }: { refund: Refund }) {
  const explanations: Record<Refund['type'], string> = {
    sla_breach: 'When an agent fails to meet its advertised SLA parameters (latency, data accuracy, uptime), you are entitled to a full or partial refund. Our SLA enforcement system automatically identifies breaches and credits your account.',
    dispute_resolved: 'When you file a dispute and our review team determines the agent failed to deliver acceptable service, a refund is issued. This can occur when the agent provides incorrect data, fails to respond, or deviates from the agreed specifications.',
    billing_error: 'Billing errors include duplicate charges, charges for sessions that failed to start, or incorrect calculations. Our system flags potential errors and credits any overcharges back to your account.',
  }

  return (
    <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-4 border-violet-500">
      <p className="text-sm text-muted-foreground mb-1">Why was I refunded?</p>
      <p className="text-sm">{explanations[refund.type]}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">SLA breach:</span>
        <Badge variant="destructive" className="text-xs">{refund.slaBreach}</Badge>
      </div>
    </div>
  )
}

export default function RefundsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const totalRefunded = MOCK_REFUNDS.reduce((sum, r) => sum + r.amount, 0)
  const slaBreachRefunds = MOCK_REFUNDS.filter((r) => r.type === 'sla_breach').reduce((sum, r) => sum + r.amount, 0)
  const disputeRefunds = MOCK_REFUNDS.filter((r) => r.type === 'dispute_resolved').reduce((sum, r) => sum + r.amount, 0)
  const billingErrorRefunds = MOCK_REFUNDS.filter((r) => r.type === 'billing_error').reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Refunds</h1>
            <p className="text-muted-foreground">
              View your refund history and understand why refunds were issued.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Refund Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Refunded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalRefunded.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">SLA Breach Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${slaBreachRefunds.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dispute Resolutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${disputeRefunds.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Billing Error Fixes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${billingErrorRefunds.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_REFUNDS.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Refund Types Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding Your Refunds</CardTitle>
            <CardDescription>How refunds are categorized and when they occur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 border rounded-lg border-red-200 bg-red-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <h4 className="font-medium">SLA Breach</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatic credit when an agent fails to meet latency, accuracy, or uptime guarantees.
                </p>
              </div>
              <div className="p-4 border rounded-lg border-green-200 bg-green-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <h4 className="font-medium">Dispute Resolved</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Refund issued after our team reviews and rules in your favor on a filed dispute.
                </p>
              </div>
              <div className="p-4 border rounded-lg border-blue-200 bg-blue-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <h4 className="font-medium">Billing Error</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Correction of duplicate charges, failed session charges, or calculation errors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Refunds List */}
        <Card>
          <CardHeader>
            <CardTitle>All Refunds</CardTitle>
            <CardDescription>Complete history of refunds received</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_REFUNDS.length > 0 ? (
              MOCK_REFUNDS.map((refund) => (
                <div key={refund.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm text-muted-foreground">{refund.id}</span>
                        <span className="font-medium">{refund.agentName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <RefundTypeBadge type={refund.type} />
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">+${refund.amount.toFixed(4)}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(refund.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ExplanationCard refund={refund} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No refunds received yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}