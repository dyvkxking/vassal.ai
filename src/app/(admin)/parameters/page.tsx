"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// ---- Mock Current Values ----
const CURRENT_PARAMS = {
  votingPeriodHours: 72,
  quorumThreshold: 60,
  proposalFeeMesh: 100,
  slashAmountMin: 50,
  slashAmountMax: 5000,
  tpmWeight: 40,
  latencyWeight: 30,
  uptimeWeight: 30,
}

function SettingsRow({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="space-y-0.5 flex-1 mr-4">
        <Label className="text-base font-medium">{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

// ---- Main Page ----
export default function ParametersPage() {
  const [votingPeriod, setVotingPeriod] = useState(CURRENT_PARAMS.votingPeriodHours.toString())
  const [quorumThreshold, setQuorumThreshold] = useState(CURRENT_PARAMS.quorumThreshold.toString())
  const [proposalFee, setProposalFee] = useState(CURRENT_PARAMS.proposalFeeMesh.toString())
  const [slashMin, setSlashMin] = useState(CURRENT_PARAMS.slashAmountMin.toString())
  const [slashMax, setSlashMax] = useState(CURRENT_PARAMS.slashAmountMax.toString())
  const [tpmWeight, setTpmWeight] = useState(CURRENT_PARAMS.tpmWeight.toString())
  const [latencyWeight, setLatencyWeight] = useState(CURRENT_PARAMS.latencyWeight.toString())
  const [uptimeWeight, setUptimeWeight] = useState(CURRENT_PARAMS.uptimeWeight.toString())

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (setter: (val: string) => void) => (val: string) => {
    setter(val)
    setHasChanges(true)
  }

  const handleSave = () => {
    setOpenConfirmDialog(false)
    setOpenSuccessDialog(true)
    setHasChanges(false)
  }

  const totalWeight = parseInt(tpmWeight || '0') + parseInt(latencyWeight || '0') + parseInt(uptimeWeight || '0')

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Protocol Parameters</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure governance and slashing parameters for the protocol.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline">Admin Only</Badge>
          <span className="text-xs text-muted-foreground">Changes require wallet signature confirmation</span>
        </div>
      </div>

      {/* Warning Alert */}
      <Alert className="mb-6" variant="destructive">
        <AlertTitle>Restricted Actions</AlertTitle>
        <AlertDescription>
          Parameter changes are irreversible and affect the entire protocol. Ensure community consensus before proceeding.
        </AlertDescription>
      </Alert>

      {/* ArrowRightvernance Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">ArrowRightvernance Settings</CardTitle>
          <CardDescription>Voting and proposal configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          <SettingsRow
            label="Voting Period"
            description="Duration that token holders can vote on active proposals"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={votingPeriod}
                onChange={(e) => handleChange(setVotingPeriod)(e.target.value)}
                className="w-24 text-right"
                min={1}
                max={720}
              />
              <span className="text-sm text-muted-foreground w-12">hours</span>
            </div>
          </SettingsRow>
          <Separator />
          <SettingsRow
            label="Quorum Threshold"
            description="Minimum percentage of total voting power required to validate a proposal"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={quorumThreshold}
                onChange={(e) => handleChange(setQuorumThreshold)(e.target.value)}
                className="w-24 text-right"
                min={1}
                max={100}
              />
              <span className="text-sm text-muted-foreground w-12">%</span>
            </div>
          </SettingsRow>
          <Separator />
          <SettingsRow
            label="Proposal Fee"
            description="MESH tokens required to submit a new proposal"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={proposalFee}
                onChange={(e) => handleChange(setProposalFee)(e.target.value)}
                className="w-24 text-right"
                min={0}
              />
              <span className="text-sm text-muted-foreground w-16">MESH</span>
            </div>
          </SettingsRow>
        </CardContent>
      </Card>

      {/* Slash Amount Ranges */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Slash Amount Ranges</CardTitle>
          <CardDescription>Minimum and maximum penalties per breach type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          <SettingsRow
            label="Minimum Slash"
            description="Lowest MESH amount deducted for minor protocol violations"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={slashMin}
                onChange={(e) => handleChange(setSlashMin)(e.target.value)}
                className="w-24 text-right"
                min={0}
              />
              <span className="text-sm text-muted-foreground w-16">MESH</span>
            </div>
          </SettingsRow>
          <Separator />
          <SettingsRow
            label="Maximum Slash"
            description="Highest MESH amount deducted for severe protocol breaches"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={slashMax}
                onChange={(e) => handleChange(setSlashMax)(e.target.value)}
                className="w-24 text-right"
                min={0}
              />
              <span className="text-sm text-muted-foreground w-16">MESH</span>
            </div>
          </SettingsRow>
        </CardContent>
      </Card>

      {/* Quality Score Weights */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Quality Score Weights</CardTitle>
          <CardDescription>
            Weights for calculating agent performance scores. Total: {totalWeight}%
            {totalWeight !== 100 && totalWeight !== 0 && (
              <span className="text-destructive ml-2">(must equal 100%)</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          <SettingsRow
            label="TPM Weight"
            description="Token per minute throughput contribution to quality score"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tpmWeight}
                onChange={(e) => handleChange(setTpmWeight)(e.target.value)}
                className="w-24 text-right"
                min={0}
                max={100}
              />
              <span className="text-sm text-muted-foreground w-12">%</span>
            </div>
          </SettingsRow>
          <Separator />
          <SettingsRow
            label="Latency Weight"
            description="Response latency contribution to quality score"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={latencyWeight}
                onChange={(e) => handleChange(setLatencyWeight)(e.target.value)}
                className="w-24 text-right"
                min={0}
                max={100}
              />
              <span className="text-sm text-muted-foreground w-12">%</span>
            </div>
          </SettingsRow>
          <Separator />
          <SettingsRow
            label="Uptime Weight"
            description="Service availability contribution to quality score"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={uptimeWeight}
                onChange={(e) => handleChange(setUptimeWeight)(e.target.value)}
                className="w-24 text-right"
                min={0}
                max={100}
              />
              <span className="text-sm text-muted-foreground w-12">%</span>
            </div>
          </SettingsRow>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {hasChanges ? (
            <span className="text-warning">You have unsaved changes</span>
          ) : (
            'No unsaved changes'
          )}
        </div>
        <Button
          variant="default"
          disabled={!hasChanges || totalWeight !== 100}
          onClick={() => setOpenConfirmDialog(true)}
        >
          Save Changes
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Parameter Changes</DialogTitle>
            <DialogDescription>
              You are about to modify critical protocol parameters. This action requires wallet signature confirmation and will be recorded on-chain.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Voting Period:</span>
              <span className="font-mono">{votingPeriod} hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quorum Threshold:</span>
              <span className="font-mono">{quorumThreshold}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Proposal Fee:</span>
              <span className="font-mono">{proposalFee} MESH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slash Range:</span>
              <span className="font-mono">{slashMin} - {slashMax} MESH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quality Weights:</span>
              <span className="font-mono">TPM {tpmWeight}% / Latency {latencyWeight}% / Uptime {uptimeWeight}%</span>
            </div>
          </div>
          <Alert>
            <AlertTitle>Wallet Signature Required</AlertTitle>
            <AlertDescription>
              You must sign this transaction with your admin wallet to confirm these changes.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              Sign & Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onOpenChange={setOpenSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parameters Updated</DialogTitle>
            <DialogDescription>
              Your parameter changes have been successfully saved and are now active on the protocol.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="default" onClick={() => setOpenSuccessDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}