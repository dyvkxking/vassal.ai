"use client"

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

// ---- Mock Audit Data ----
const MOCK_AUDIT = {
  id: 'skill-req-001',
  name: 'On-Chain Transaction Decoder',
  author: '0xaaaa...1111',
  version: '1.0.0',
  category: 'infrastructure',
  submittedAt: Date.now() - 86400000 * 3,
  status: 'pending' as const,
  description: 'Reads on-chain transaction data from Ethereum and EVM-compatible chains with full revert reason support.',
  inputSchema: { chainId: 'number', txHash: 'string', includeRevertReason: 'boolean' },
  outputSchema: { txHash: 'string', blockNumber: 'number', status: 'string', gasUsed: 'number', revertReason: 'string | null' },
  parameters: [
    { name: 'chainId', type: 'number', required: true, description: 'EVM chain ID (1=Ethereum, 137=Polygon, etc.)' },
    { name: 'txHash', type: 'string', required: true, description: 'Transaction hash to decode' },
    { name: 'includeRevertReason', type: 'boolean', required: false, description: 'Include revert reason string if transaction failed' },
  ],
  errorCodes: [
    { code: 'ERR_CHAIN_UNSUPPORTED', message: 'Chain ID not supported', resolution: 'Use an EVM-compatible chain ID' },
    { code: 'ERR_TX_NOT_FOUND', message: 'Transaction not found or not yet indexed', resolution: 'Wait for transaction to be mined or check hash' },
  ],
}

// ---- Audit Checklist ----
const AUDIT_CHECKLIST = [
  { id: 'input-schema', label: 'Input Schema Valid', description: 'Input schema is well-structured and documented', pass: null as boolean | null },
  { id: 'output-schema', label: 'Output Schema Valid', description: 'Output schema matches specification', pass: null as boolean | null },
  { id: 'parameters', label: 'Parameters Documented', description: 'All parameters have clear descriptions and types', pass: null as boolean | null },
  { id: 'error-codes', label: 'Error Codes Defined', description: 'All error codes have resolutions', pass: null as boolean | null },
  { id: 'docs-quality', label: 'Documentation Quality', description: 'README and usage examples are clear', pass: null as boolean | null },
  { id: 'pricing', label: 'Pricing Reasonable', description: 'Price per invocation is appropriate for the skill', pass: null as boolean | null },
  { id: 'security', label: 'No Security Vulnerabilities', description: 'No obvious injection or data leakage risks', pass: null as boolean | null },
  { id: 'testnet', label: 'Testnet Validation Passed', description: 'Skill works correctly on testnet', pass: null as boolean | null },
]

// ---- Audit History ----
const AUDIT_HISTORY = [
  {
    id: 'hist-001',
    action: 'Submitted for Review',
    auditor: 'system',
    timestamp: Date.now() - 86400000 * 3,
    note: 'Skill submitted to audit queue.',
  },
  {
    id: 'hist-002',
    action: 'Auto-Security Scan',
    auditor: 'system',
    timestamp: Date.now() - 86400000 * 3 + 3600000,
    note: 'Passed automated security checks.',
  },
]

function ChecklistItem({
  item,
  onToggle,
}: {
  item: (typeof AUDIT_CHECKLIST)[0]
  onToggle: (id: string, pass: boolean) => void
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border">
      <div className="flex items-center gap-2 mt-0.5">
        {item.pass === true && (
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {item.pass === false && (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {item.pass === null && (
          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{item.label}</p>
        <p className="text-xs text-muted-foreground">{item.description}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant={item.pass === true ? 'default' : 'outline'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => onToggle(item.id, true)}
        >
          Pass
        </Button>
        <Button
          variant={item.pass === false ? 'destructive' : 'outline'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => onToggle(item.id, false)}
        >
          Fail
        </Button>
      </div>
    </div>
  )
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function SkillAuditDetailPage() {
  const params = useParams()
  const skillId = params.id as string

  const [checklist, setChecklist] = useState(AUDIT_CHECKLIST)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [changesDialogOpen, setChangesDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [changesRequest, setChangesRequest] = useState('')
  const [auditNote, setAuditNote] = useState('')

  const handleToggle = (id: string, pass: boolean) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, pass } : item
      )
    )
  }

  const allChecked = checklist.every(item => item.pass !== null)
  const passedCount = checklist.filter(item => item.pass === true).length

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/skill-audit" className="hover:text-foreground">
          Skill Audit
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{skillId}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{MOCK_AUDIT.name}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline">{MOCK_AUDIT.category}</Badge>
              <Badge variant="outline" className="font-mono">v{MOCK_AUDIT.version}</Badge>
              <Badge variant="secondary">Pending Review</Badge>
              <Separator orientation="vertical" className="h-4" />
              <span>by <span className="font-mono">{MOCK_AUDIT.author}</span></span>
              <Separator orientation="vertical" className="h-4" />
              <span>Submitted {formatDate(MOCK_AUDIT.submittedAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setChangesDialogOpen(true)}>
              Request Changes
            </Button>
            <Button variant="destructive" onClick={() => setRejectDialogOpen(true)}>
              Reject
            </Button>
            <Button
              variant="default"
              disabled={!allChecked}
              onClick={() => setApproveDialogOpen(true)}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Audit Progress</span>
            <span className="text-sm text-muted-foreground">{passedCount}/{checklist.length} items reviewed</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(passedCount / checklist.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {/* Skill Info */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{MOCK_AUDIT.description}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-sm font-medium capitalize">{MOCK_AUDIT.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="text-sm font-mono font-medium">{MOCK_AUDIT.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-sm font-mono font-medium">0.00001 MESH/call</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Spec */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Spec Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Input Schema</p>
              <pre className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
                {JSON.stringify(MOCK_AUDIT.inputSchema, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Output Schema</p>
              <pre className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
                {JSON.stringify(MOCK_AUDIT.outputSchema, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Parameters</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_AUDIT.parameters.map((param) => (
                    <TableRow key={param.name}>
                      <TableCell className="font-mono font-medium">{param.name}</TableCell>
                      <TableCell><Badge variant="outline">{param.type}</Badge></TableCell>
                      <TableCell>
                        {param.required ? (
                          <Badge className="bg-red-500/10 text-red-500">Required</Badge>
                        ) : (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{param.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Error Codes</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Resolution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_AUDIT.errorCodes.map((err) => (
                    <TableRow key={err.code}>
                      <TableCell className="font-mono text-xs">{err.code}</TableCell>
                      <TableCell className="text-sm">{err.message}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{err.resolution}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Audit Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Checklist</CardTitle>
            <CardDescription>Mark each item as pass or fail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <ChecklistItem key={item.id} item={item} onToggle={handleToggle} />
            ))}
          </CardContent>
        </Card>

        {/* Audit Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add notes about this skill (optional)..."
              rows={4}
              value={auditNote}
              onChange={(e) => setAuditNote(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Audit History */}
        <Card>
          <CardHeader>
            <CardTitle>Audit History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {AUDIT_HISTORY.map((entry, idx) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    {idx < AUDIT_HISTORY.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{entry.action}</span>
                      <Badge variant="outline" className="text-xs">{entry.auditor}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Skill</DialogTitle>
            <DialogDescription>
              This will publish "{MOCK_AUDIT.name}" to the marketplace. Confirm?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={() => setApproveDialogOpen(false)}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Skill</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting "{MOCK_AUDIT.name}".
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setRejectDialogOpen(false); setRejectReason('') }}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={changesDialogOpen} onOpenChange={setChangesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Describe changes needed for "{MOCK_AUDIT.name}".
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Required changes..."
            value={changesRequest}
            onChange={(e) => setChangesRequest(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangesDialogOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => { setChangesDialogOpen(false); setChangesRequest('') }}>Send Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}