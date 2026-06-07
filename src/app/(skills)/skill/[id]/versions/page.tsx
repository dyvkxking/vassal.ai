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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ---- Mock Version Data ----
const VERSION_DATA = [
  {
    version: '2.1.0',
    date: Date.now() - 30 * 86400000,
    status: 'active' as const,
    invocations: 1240000,
    revenue: 12.4,
    changelog: 'Optimized schema validation and added support for trace data in EVM chains.',
    breaking: false,
  },
  {
    version: '2.0.0',
    date: Date.now() - 90 * 86400000,
    status: 'deprecated' as const,
    invocations: 890000,
    revenue: 8.9,
    changelog: 'Major version with improved input validation and new error handling.',
    breaking: true,
  },
  {
    version: '1.5.0',
    date: Date.now() - 180 * 86400000,
    status: 'deprecated' as const,
    invocations: 456000,
    revenue: 4.56,
    changelog: 'Added support for Polygon and Arbitrum networks.',
    breaking: false,
  },
  {
    version: '1.0.0',
    date: Date.now() - 365 * 86400000,
    status: 'deprecated' as const,
    invocations: 123000,
    revenue: 1.23,
    changelog: 'Initial public release with Ethereum mainnet support.',
    breaking: true,
  },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function DeprecateDialog({
  version,
  open,
  onOpenChange,
}: {
  version: string
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deprecate Version {version}</DialogTitle>
          <DialogDescription>
            Deprecating will mark this version as inactive. Existing agents using this version will continue to work, but new agents will use the active version.
          </DialogDescription>
        </DialogHeader>
        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <p className="text-sm text-amber-500">
            This action affects {VERSION_DATA.find(v => v.version === version)?.invocations.toLocaleString()} historical invocations.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => onOpenChange(false)}>Deprecate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ActivateDialog({
  version,
  open,
  onOpenChange,
}: {
  version: string
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Version {version} as Active</DialogTitle>
          <DialogDescription>
            This version will become the default for new agent integrations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="default" onClick={() => onOpenChange(false)}>Activate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function VersionsTable() {
  const [deprecateVersion, setDeprecateVersion] = useState<string | null>(null)
  const [activateVersion, setActivateVersion] = useState<string | null>(null)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invocations</TableHead>
            <TableHead>Revenue (MESH)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {VERSION_DATA.map((ver) => (
            <TableRow key={ver.version}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold">v{ver.version}</span>
                  {ver.breaking && (
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                      Breaking
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(ver.date)}
              </TableCell>
              <TableCell>
                <Badge variant={ver.status === 'active' ? 'default' : 'secondary'}>
                  {ver.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {ver.invocations.toLocaleString()}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {ver.revenue.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {ver.status === 'deprecated' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setActivateVersion(ver.version)}
                    >
                      Set Active
                    </Button>
                  )}
                  {ver.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs text-amber-500 border-amber-500/50 hover:bg-amber-500/10"
                      onClick={() => setDeprecateVersion(ver.version)}
                    >
                      Deprecate
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeprecateDialog
        version={deprecateVersion || ''}
        open={!!deprecateVersion}
        onOpenChange={(o) => !o && setDeprecateVersion(null)}
      />
      <ActivateDialog
        version={activateVersion || ''}
        open={!!activateVersion}
        onOpenChange={(o) => !o && setActivateVersion(null)}
      />
    </div>
  )
}

function ChangelogView() {
  return (
    <div className="space-y-4">
      {VERSION_DATA.map((ver, idx) => (
        <Card key={ver.version}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={ver.status === 'active' ? 'default' : 'secondary'}>
                  v{ver.version}
                </Badge>
                {ver.breaking && (
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Breaking</Badge>
                )}
                {ver.status === 'active' && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Current</Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{formatDate(ver.date)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{ver.changelog}</p>
            <Separator className="mt-4" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-xs text-muted-foreground">Invocations</p>
                <p className="text-sm font-mono font-medium">{ver.invocations.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-sm font-mono font-medium">{ver.revenue.toFixed(4)} MESH</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Share</p>
                <p className="text-sm font-medium">
                  {Math.round((ver.invocations / VERSION_DATA.reduce((acc, v) => acc + v.invocations, 0)) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function SkillVersionsPage() {
  const params = useParams()
  const skillId = params.id as string
  const skill = { name: 'On-Chain Transaction Decoder', id: skillId }

  const totalInvocations = VERSION_DATA.reduce((acc, v) => acc + v.invocations, 0)
  const totalRevenue = VERSION_DATA.reduce((acc, v) => acc + v.revenue, 0)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href={`/skill/${skillId}`} className="hover:text-foreground">
          {skill.name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Versions</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Version History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track all releases, deprecate old versions, and set the active version.
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Versions:</span>{' '}
            <span className="font-medium">{VERSION_DATA.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Invocations:</span>{' '}
            <span className="font-mono font-medium">{totalInvocations.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Revenue:</span>{' '}
            <span className="font-mono font-medium">{totalRevenue.toFixed(4)} MESH</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="table">Versions Table</TabsTrigger>
          <TabsTrigger value="changelog">Changelog</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>All Versions</CardTitle>
              <CardDescription>Manage version lifecycle</CardDescription>
            </CardHeader>
            <CardContent>
              <VersionsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changelog">
          <ChangelogView />
        </TabsContent>
      </Tabs>
    </div>
  )
}