"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ---- Proposal Parameter Settings ----
interface SlashAmountInputProps {
  label: string
  description: string
  currentValue: string
}

function SlashAmountInput({ label, description, currentValue }: SlashAmountInputProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Input
          type="number"
          defaultValue={currentValue}
          className="w-20 text-right font-mono"
        />
        <span className="text-sm text-muted-foreground">%</span>
      </div>
    </div>
  )
}

interface SlaThresholdInputProps {
  label: string
  description: string
  currentValue: string
  unit: string
}

function SlaThresholdInput({ label, description, currentValue, unit }: SlaThresholdInputProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Input
          type="number"
          defaultValue={currentValue}
          className="w-20 text-right font-mono"
        />
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}

interface QuorumInputProps {
  label: string
  currentValue: string
}

function QuorumInput({ label, currentValue }: QuorumInputProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2 shrink-0">
        <Input
          type="number"
          defaultValue={currentValue}
          className="w-24 text-right font-mono"
        />
        <span className="text-sm text-muted-foreground">$MESH</span>
      </div>
    </div>
  )
}

function ProposalParametersSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Proposal Parameter Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Slash Amounts */}
        <div>
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Slash Amounts
          </div>
          <div className="space-y-4">
            <SlashAmountInput
              label="Latency Breach"
              description="Penalty for exceeding latency SLA threshold"
              currentValue="5"
            />
            <SlashAmountInput
              label="TPM Overconsumption"
              description="Penalty for exceeding tokens-per-minute cap"
              currentValue="3"
            />
            <SlashAmountInput
              label="Uptime Violation"
              description="Penalty for falling below uptime guarantee"
              currentValue="10"
            />
            <SlashAmountInput
              label="Data Manipulation"
              description="Penalty for tampering with session data or learning signals"
              currentValue="25"
            />
          </div>
        </div>

        <Separator />

        {/* SLA Thresholds */}
        <div>
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            SLA Thresholds
          </div>
          <div className="space-y-4">
            <SlaThresholdInput
              label="Max Latency"
              description="Maximum allowed average latency per session"
              currentValue="1500"
              unit="ms"
            />
            <SlaThresholdInput
              label="Max TPM"
              description="Default tokens-per-minute cap"
              currentValue="100000"
              unit="tokens"
            />
            <SlaThresholdInput
              label="Min Uptime"
              description="Minimum uptime guarantee required"
              currentValue="99"
              unit="%"
            />
          </div>
        </div>

        <Separator />

        {/* Quorum Requirements */}
        <div>
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quorum Requirements
          </div>
          <div className="space-y-4">
            <QuorumInput label="ArrowRightvernance Quorum" currentValue="5000000" />
            <QuorumInput label="Emergency Proposal Quorum" currentValue="8000000" />
            <QuorumInput label="Protocol Upgrade Quorum" currentValue="10000000" />
          </div>
        </div>

        <Separator />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="default" size="sm">
            Save Parameters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Emergency Stop Section ----
function EmergencyStopSection() {
  const [protocolPaused, setProtocolPaused] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Emergency Stop</CardTitle>
          <Badge variant={protocolPaused ? 'destructive' : 'default'}>
            {protocolPaused ? 'Protocol Paused' : 'Protocol Active'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Immediately pauses all agent sessions, slash events, and proposal voting. Use only in emergency situations.
        </p>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="destructive"
              className="w-full"
              size="lg"
            >
              Pause Protocol
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emergency Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately pause all agent sessions and halt slash events and governance voting. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => setProtocolPaused(true)}
              >
                Confirm Emergency Pause
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {protocolPaused && (
          <div className="space-y-3">
            <Separator />
            <p className="text-sm font-medium">Resume Protocol</p>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="outline" className="w-full">
                  Resume Protocol
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Resume Protocol</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will resume all agent sessions and re-enable governance voting. Continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setProtocolPaused(false)}>
                    Confirm Resume
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ---- Treasury Management Section ----
const TREASURY_TRANSACTIONS = [
  { id: 'tx-001', type: 'slash', amount: '+0.0245 $MESH', description: 'Latency breach penalty — node-001', date: 'Jun 6, 2026' },
  { id: 'tx-002', type: 'slash', amount: '+0.0120 $MESH', description: 'TPM overconsumption — node-002', date: 'Jun 5, 2026' },
  { id: 'tx-003', type: 'withdraw', amount: '-50.00 $MESH', description: 'Treasury withdrawal — governance ops', date: 'Jun 1, 2026' },
  { id: 'tx-004', type: 'slash', amount: '+0.0080 $MESH', description: 'Uptime violation — node-003', date: 'May 28, 2026' },
]

function TreasuryManagementSection() {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Treasury Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Treasury Balance</span>
          <span className="text-2xl font-bold font-mono">1,247.83 $MESH</span>
        </div>

        <Separator />

        {/* Recent Transactions */}
        <div>
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Transactions
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TREASURY_TRANSACTIONS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Badge
                      variant={tx.type === 'slash' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {tx.amount}
                  </TableCell>
                  <TableCell className="text-xs truncate max-w-[200px]">
                    {tx.description}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {tx.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Withdrawal Form */}
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Withdraw Funds
          </div>
          <div className="grid gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Recipient Address</Label>
              <Input
                placeholder="0x..."
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Amount ($MESH)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button variant="outline" className="w-full">
              Withdraw
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Main Page ----
export default function ArrowRightvernanceAdminPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">ArrowRightvernance Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage protocol parameters, emergency controls, and treasury.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Proposal Parameters + Emergency Stop */}
        <div className="space-y-6">
          <ProposalParametersSection />
          <EmergencyStopSection />
        </div>

        {/* Right Column: Treasury Management */}
        <div className="space-y-6">
          <TreasuryManagementSection />
        </div>
      </div>
    </div>
  )
}
