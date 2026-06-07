"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// ---- Mock Data ----
const PROTOCOL_STATUS = {
  running: true,
  lastPausedAt: null as number | null,
  totalPauses: 2,
  affectedEndpoints: 14,
}

const AFFECTED_SERVICES = [
  { name: 'Agent Marketplace API', status: 'active' },
  { name: 'Session Routing', status: 'active' },
  { name: 'TPM Quota System', status: 'active' },
  { name: 'Slash Execution Engine', status: 'active' },
  { name: 'Provider Registry', status: 'active' },
]

const EMERGENCY_CONTACTS = [
  { role: 'Protocol Lead', name: '0xALPHA...1111', availability: '24/7' },
  { role: 'Security Lead', name: '0xBETA...2222', availability: '24/7' },
  { role: 'On-Call Engineer', name: '0xGAMMA...3333', availability: 'HVAC' },
]

const ACTIVITY_LOG = [
  {
    id: 'log-001',
    action: 'PAUSE_PROTOCOL',
    actor: '0xSECU...9999',
    reason: 'DDoS attack detected on provider nodes',
    timestamp: Date.now() - 86400000 * 2,
    outcome: 'success',
  },
  {
    id: 'log-002',
    action: 'RESUME_PROTOCOL',
    actor: '0xSECU...9999',
    reason: 'Threat mitigated — services restored',
    timestamp: Date.now() - 86400000 * 2 + 3600000 * 4,
    outcome: 'success',
  },
  {
    id: 'log-003',
    action: 'PAUSE_PROTOCOL',
    actor: '0xADMIN...7777',
    reason: 'Scheduled maintenance window',
    timestamp: Date.now() - 86400000 * 7,
    outcome: 'success',
  },
  {
    id: 'log-004',
    action: 'RESUME_PROTOCOL',
    actor: '0xADMIN...7777',
    reason: 'Maintenance completed',
    timestamp: Date.now() - 86400000 * 7 + 3600000 * 2,
    outcome: 'success',
  },
]

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type ProtocolState = 'running' | 'paused'

// ---- Emergency Contacts Section ----
function EmergencyContactsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Emergency Contacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {EMERGENCY_CONTACTS.map((contact) => (
          <div key={contact.role} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{contact.role}</p>
              <p className="text-xs font-mono text-muted-foreground">{contact.name}</p>
            </div>
            <Badge variant={contact.availability === '24/7' ? 'default' : 'outline'}>
              {contact.availability}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ---- Affected Services ----
function AffectedServicesSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Affected Services</CardTitle>
          <Badge variant="outline">{AFFECTED_SERVICES.length} endpoints</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {AFFECTED_SERVICES.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm">{svc.name}</span>
              <Badge variant="default" className="text-xs">active</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Activity Log ----
function ActivityLogSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Emergency Action Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVITY_LOG.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge
                    variant={log.action.includes('PAUSE') ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {log.action.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{log.actor}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                  {log.reason}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDateTime(log.timestamp)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{log.outcome}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ---- Main Page ----
export default function EmergencyStopPage() {
  const [protocolState, setProtocolState] = useState<ProtocolState>('running')
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false)
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false)
  const [pauseReason, setPauseReason] = useState('')

  const isPaused = protocolState === 'paused'

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Emergency Stop</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Protocol-level emergency controls. Use only in critical situations.
        </p>
      </div>

      {/* Warning Banner */}
      <Alert className="mb-6" variant="destructive">
        <AlertTitle>High Risk Area</AlertTitle>
        <AlertDescription>
          Emergency stop actions require wallet signature and are logged with full accountability.
          Pausing the protocol will halt all agent sessions and slashing events immediately.
        </AlertDescription>
      </Alert>

      {/* Status Banner */}
      <Card className="mb-6 border-2 border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`h-4 w-4 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500'}`}
              />
              <div>
                <p className="text-lg font-bold">
                  Protocol {isPaused ? 'PAUSED' : 'RUNNING'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isPaused
                    ? 'All agent sessions and slash events are halted'
                    : 'All systems operational — agents can be executed'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Pauses (all time)</p>
                <p className="text-2xl font-bold">{PROTOCOL_STATUS.totalPauses}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Affected Endpoints</p>
                <p className="text-2xl font-bold">{PROTOCOL_STATUS.affectedEndpoints}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        {!isPaused ? (
          <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="lg" className="px-8">
                Pause Protocol
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Emergency Pause</DialogTitle>
                <DialogDescription>
                  This will halt all agent sessions, slash events, and provider communications.
                  Enter the emergency reason and sign with your wallet to confirm.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <label className="text-sm font-medium">Emergency Reason</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
                  placeholder="Describe the emergency..."
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPauseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setProtocolState('paused')
                    setPauseDialogOpen(false)
                    setPauseReason('')
                  }}
                >
                  Sign &amp; Pause Protocol
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="lg" className="bg-green-600 hover:bg-green-700 px-8">
                Resume Protocol
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resume Protocol</DialogTitle>
                <DialogDescription>
                  This will restore all agent sessions and slash event processing.
                  Confirm that the emergency has been resolved.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResumeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setProtocolState('running')
                    setResumeDialogOpen(false)
                  }}
                >
                  Sign &amp; Resume
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Separator className="mb-6" />

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AffectedServicesSection />
          <EmergencyContactsSection />
        </div>
        <ActivityLogSection />
      </div>
    </div>
  )
}