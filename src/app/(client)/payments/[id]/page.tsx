'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// Mock payment data - in real app would be fetched based on ID
const MOCK_PAYMENT = {
  id: 'tx-001',
  date: Date.now() - 86400000,
  agentId: 'agent-001',
  agentName: 'DeFi Pulse Scanner',
  amount: 0.045,
  status: 'completed' as 'completed' | 'pending' | 'failed' | 'refunded',
  txHash: '0xabc123...def456',
  sessionId: 'session-123',
  latencyMs: 1240,
  tpmUsed: 850,
  slaCompliance: 'passed' as const,
  slaBreach: null as string | null,
  refundEligible: false,
  refundAmount: null as number | null,
}

const MOCK_SESSION = {
  id: 'session-123',
  duration: 45,
  startTime: Date.now() - 86400000 - 2700000,
  endTime: Date.now() - 86400000,
  query: 'Monitor DeFi yield opportunities across multiple protocols',
}

export default function PaymentReceiptPage({ params }: { params: { id: string } }) {
  const payment = MOCK_PAYMENT // In real app: use params.id to fetch

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Payment Receipt</h1>
              <Badge variant="outline" className="font-mono">{payment.id}</Badge>
            </div>
            <p className="text-muted-foreground">
              Transaction details and receipt for your payment
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Transaction receipt details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Agent</span>
                <span className="font-medium">{payment.agentName}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium font-mono">
                  {new Date(payment.date).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-2xl font-bold">${payment.amount.toFixed(4)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    payment.status === 'completed' && 'bg-green-100 text-green-700',
                    payment.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                    payment.status === 'refunded' && 'bg-blue-100 text-blue-700'
                  )}
                >
                  {payment.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Transaction Hash</span>
                <span className="font-mono text-sm">{payment.txHash}</span>
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
              <CardDescription>Associated session information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Session ID</span>
                <span className="font-mono text-sm">{MOCK_SESSION.id}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{MOCK_SESSION.duration} minutes</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Start Time</span>
                <span className="font-mono text-sm">
                  {new Date(MOCK_SESSION.startTime).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">End Time</span>
                <span className="font-mono text-sm">
                  {new Date(MOCK_SESSION.endTime).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="py-3">
                <span className="text-muted-foreground block mb-2">Query</span>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{MOCK_SESSION.query}</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  View Full Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SLA Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>SLA Compliance</CardTitle>
              <CardDescription>Service level agreement check results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Result</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    payment.slaCompliance === 'passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  )}
                >
                  {payment.slaCompliance === 'passed' ? 'Passed' : 'Failed'}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Latency</span>
                <span className="font-mono">{payment.latencyMs}ms</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">TPM Used</span>
                <span className="font-mono">{payment.tpmUsed.toLocaleString()}</span>
              </div>
              {payment.slaBreach && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">SLA Breach</span>
                    <Badge variant="destructive">{payment.slaBreach}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Refund Information */}
          {payment.refundEligible && payment.refundAmount && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-green-700">Refund Processed</CardTitle>
                <CardDescription>You received a refund for this transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Refund Amount</span>
                  <span className="text-2xl font-bold text-green-600">+${payment.refundAmount.toFixed(4)}</span>
                </div>
                {payment.slaBreach && (
                  <div className="p-3 bg-green-100/50 rounded-lg">
                    <p className="text-sm text-green-800">
                      Refund issued due to: {payment.slaBreach}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Download Receipt */}
          <Card>
            <CardContent className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-violet-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Download Receipt</p>
                  <p className="text-sm text-muted-foreground">Get a PDF copy of this transaction</p>
                </div>
              </div>
              <Button variant="outline">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}