'use client'

import { useState } from 'react'
import { MOCK_PROVIDER_NODES } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
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

const STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  warning: 'bg-yellow-500',
  maintenance: 'bg-blue-500',
} as const

const STATUS_BADGE_COLORS = {
  online: 'bg-green-500/10 text-green-600 border-green-500/20',
  offline: 'bg-red-500/10 text-red-600 border-red-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  maintenance: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
} as const

const NODE_LOGS = [
  '[2024-01-15 10:23:45] Node started',
  '[2024-01-15 10:23:46] Heartbeat sent',
  '[2024-01-15 10:23:56] Session assigned: agent-001',
  '[2024-01-15 10:24:12] Processing request from client 0xclient...1111',
  '[2024-01-15 10:24:30] TPM used: 45000, latency: 980ms',
  '[2024-01-15 10:25:00] Heartbeat sent',
  '[2024-01-15 10:26:00] Heartbeat sent',
  '[2024-01-15 10:26:45] Session completed successfully',
  '[2024-01-15 10:27:00] Heartbeat sent',
  '[2024-01-15 10:28:00] Heartbeat sent',
]

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function formatHeartbeatAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export default function NodeManagementPage() {
  const node = MOCK_PROVIDER_NODES[0]
  const [configValues, setConfigValues] = useState({
    maxConcurrentSessions: '5',
    minTpmFloor: '50000',
    maxLatencyThreshold: '1500',
  })

  const handleUpdateConfig = (field: string) => {
    console.log(`Updating ${field} to:`, configValues[field as keyof typeof configValues])
  }

  const handleRunDiagnostics = () => {
    console.log('Running diagnostics...')
  }

  const handleCheckHeartbeat = () => {
    console.log('Checking heartbeat...')
  }

  const handleRestartNode = () => {
    console.log('Restarting node...')
  }

  const handleGracefulShutdown = () => {
    console.log('Graceful shutdown initiated...')
  }

  // Simulated resource usage (in real app would come from node metrics)
  const cpuUsage = 67
  const ramUsage = 45
  const diskUsage = 23

  return (
    <div className="container py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Node Management</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and configure your compute provider node
        </p>
      </div>

      {/* Node Status Banner */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`size-3 rounded-full ${STATUS_COLORS[node.status]}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg capitalize">{node.status}</span>
                  <Badge
                    variant="outline"
                    className={STATUS_BADGE_COLORS[node.status]}
                  >
                    {node.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last heartbeat: {formatHeartbeatAgo(node.lastHeartbeat)} ({formatTimestamp(node.lastHeartbeat)})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Node ID:</span>
              <code className="bg-muted px-2 py-1 rounded font-mono">{node.id}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hardware Metrics Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Hardware Specifications</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{node.hardware.cpuCores}</div>
              <div className="text-xs text-muted-foreground mt-1">CPU Cores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold truncate">{node.hardware.gpuModel ?? 'N/A'}</div>
              <div className="text-xs text-muted-foreground mt-1">GPU Model</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{node.hardware.gpuMemoryGb ?? 'N/A'}</div>
              <div className="text-xs text-muted-foreground mt-1">GPU Memory (GB)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{node.hardware.ramGb}</div>
              <div className="text-xs text-muted-foreground mt-1">RAM (GB)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{node.hardware.diskGb}</div>
              <div className="text-xs text-muted-foreground mt-1">Disk (GB)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{node.hardware.bandwidthMbps}</div>
              <div className="text-xs text-muted-foreground mt-1">Bandwidth (Mbps)</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>CPU Usage</span>
              <span className="text-muted-foreground">{cpuUsage}%</span>
            </div>
            <Progress value={cpuUsage} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>RAM Usage</span>
              <span className="text-muted-foreground">{ramUsage}%</span>
            </div>
            <Progress value={ramUsage} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Disk Usage</span>
              <span className="text-muted-foreground">{diskUsage}%</span>
            </div>
            <Progress value={diskUsage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Node Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Max Concurrent Sessions */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="max-concurrent-sessions">
                Max Concurrent Sessions
              </label>
              <div className="flex gap-2">
                <Input
                  id="max-concurrent-sessions"
                  type="number"
                  value={configValues.maxConcurrentSessions}
                  onChange={(e) =>
                    setConfigValues((prev) => ({ ...prev, maxConcurrentSessions: e.target.value }))
                  }
                  className="flex-1"
                />
                <Button size="sm" onClick={() => handleUpdateConfig('maxConcurrentSessions')}>
                  Update
                </Button>
              </div>
            </div>

            {/* Min TPM Floor */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="min-tpm-floor">
                Min TPM Floor
              </label>
              <div className="flex gap-2">
                <Input
                  id="min-tpm-floor"
                  type="number"
                  value={configValues.minTpmFloor}
                  onChange={(e) =>
                    setConfigValues((prev) => ({ ...prev, minTpmFloor: e.target.value }))
                  }
                  className="flex-1"
                />
                <Button size="sm" onClick={() => handleUpdateConfig('minTpmFloor')}>
                  Update
                </Button>
              </div>
            </div>

            {/* Max Latency Threshold */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="max-latency-threshold">
                Max Latency Threshold (ms)
              </label>
              <div className="flex gap-2">
                <Input
                  id="max-latency-threshold"
                  type="number"
                  value={configValues.maxLatencyThreshold}
                  onChange={(e) =>
                    setConfigValues((prev) => ({ ...prev, maxLatencyThreshold: e.target.value }))
                  }
                  className="flex-1"
                />
                <Button size="sm" onClick={() => handleUpdateConfig('maxLatencyThreshold')}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostic Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleRunDiagnostics}>
              Run Diagnostics
            </Button>
            <Button variant="outline" onClick={handleCheckHeartbeat}>
              Check Heartbeat
            </Button>
            <Button variant="outline" onClick={handleRestartNode}>
              Restart Node
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Node Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Node Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto h-48 overflow-y-auto">
            {NODE_LOGS.join('\n')}
          </pre>
        </CardContent>
      </Card>

      {/* Graceful Shutdown */}
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold">Graceful Shutdown</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Initiate a controlled shutdown of your node. Active sessions will be gracefully terminated.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">Graceful Shutdown</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will gracefully shut down your node. All active sessions will be terminated
                    and your node will go offline. You can restart your node at any time.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleGracefulShutdown}>
                    Confirm Shutdown
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}