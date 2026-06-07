'use client'

import { useState } from 'react'
import { MOCK_PROVIDER_NODES, MOCK_SKILLS } from '@/lib/mock-data'
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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'

const STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  warning: 'bg-yellow-500',
  maintenance: 'bg-blue-500',
  draining: 'bg-orange-500',
} as const

const STATUS_BADGE_COLORS = {
  online: 'bg-green-500/10 text-green-600 border-green-500/20',
  offline: 'bg-red-500/10 text-red-600 border-red-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  maintenance: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  draining: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
} as const

const LOG_LEVELS = ['info', 'warn', 'error', 'debug'] as const
type LogLevel = typeof LOG_LEVELS[number]

interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  message: string
}

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: Date.now() - 1000, level: 'info', message: 'Node started successfully' },
  { id: '2', timestamp: Date.now() - 2000, level: 'info', message: 'Heartbeat sent to network' },
  { id: '3', timestamp: Date.now() - 5000, level: 'debug', message: 'Checking peer connections...' },
  { id: '4', timestamp: Date.now() - 8000, level: 'info', message: 'Session assigned: agent-001' },
  { id: '5', timestamp: Date.now() - 12000, level: 'warn', message: 'High latency detected: 1200ms' },
  { id: '6', timestamp: Date.now() - 15000, level: 'info', message: 'TPM usage: 45000/100000' },
  { id: '7', timestamp: Date.now() - 18000, level: 'error', message: 'Connection timeout to peer node-002' },
  { id: '8', timestamp: Date.now() - 20000, level: 'info', message: 'Reconnected successfully' },
  { id: '9', timestamp: Date.now() - 25000, level: 'info', message: 'Session completed: session-001' },
  { id: '10', timestamp: Date.now() - 30000, level: 'debug', message: 'Garbage collection triggered' },
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

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  warn: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-600 border-red-500/20',
  debug: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
}

export default function NodeManagementPage() {
  const node = MOCK_PROVIDER_NODES[0]
  const [configValues, setConfigValues] = useState({
    maxConcurrentSessions: '5',
    minTpmFloor: '50000',
    maxLatencyThreshold: '1500',
  })
  const [skillWhitelist, setSkillWhitelist] = useState<string[]>(['skill-web3-read', 'skill-price-feed'])
  const [autoRestartOnCrash, setAutoRestartOnCrash] = useState(true)
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false)
  const [diagnosticResults, setDiagnosticResults] = useState<{
    network: { status: 'pass' | 'warn' | 'fail'; message: string; latency?: number }
    sla: { status: 'pass' | 'warn' | 'fail'; message: string; compliance?: number }
    diagnostics: { status: 'pass' | 'warn' | 'fail'; message: string }
  } | null>(null)

  const handleUpdateConfig = (field: string) => {
    console.log(`Updating ${field} to:`, configValues[field as keyof typeof configValues])
  }

  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setDiagnosticResults({
      network: { status: 'pass', message: 'Network connectivity stable', latency: 45 },
      sla: { status: 'pass', message: 'SLA compliance at 99.4%', compliance: 99.4 },
      diagnostics: { status: 'pass', message: 'All systems operational' },
    })
    setIsRunningDiagnostics(false)
  }

  const handleTestNetwork = () => {
    console.log('Testing network...')
  }

  const handleCheckSlaCompliance = () => {
    console.log('Checking SLA compliance...')
  }

  const handleRestartNode = () => {
    console.log('Restarting node...')
  }

  const handleGracefulShutdown = () => {
    console.log('Graceful shutdown initiated...')
  }

  const handleToggleSkill = (skillId: string) => {
    setSkillWhitelist(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  // Simulated resource usage
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

      {/* Tabs for Configuration, Diagnostics, Logs */}
      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="skills">Skill Whitelist</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Node Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auto-restart on Crash</label>
                  <p className="text-sm text-muted-foreground">
                    Automatically restart the node if it crashes
                  </p>
                </div>
                <Switch
                  checked={autoRestartOnCrash}
                  onCheckedChange={setAutoRestartOnCrash}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnostics Tab */}
        <TabsContent value="diagnostics" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Diagnostic Tools</CardTitle>
                <Button
                  onClick={handleRunDiagnostics}
                  disabled={isRunningDiagnostics}
                >
                  {isRunningDiagnostics ? 'Running...' : 'Run All Diagnostics'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="p-4 border-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Network Latency</span>
                    {diagnosticResults ? (
                      diagnosticResults.network.status === 'pass' ? (
                        <Badge className="bg-green-500/10 text-green-600">Pass</Badge>
                      ) : diagnosticResults.network.status === 'warn' ? (
                        <Badge className="bg-yellow-500/10 text-yellow-600">Warn</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-600">Fail</Badge>
                      )
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                  {diagnosticResults && (
                    <p className="text-sm text-muted-foreground">
                      Latency: {diagnosticResults.network.latency}ms
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={handleTestNetwork}
                  >
                    Test Network
                  </Button>
                </Card>

                <Card className="p-4 border-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">SLA Compliance</span>
                    {diagnosticResults ? (
                      diagnosticResults.sla.status === 'pass' ? (
                        <Badge className="bg-green-500/10 text-green-600">Pass</Badge>
                      ) : diagnosticResults.sla.status === 'warn' ? (
                        <Badge className="bg-yellow-500/10 text-yellow-600">Warn</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-600">Fail</Badge>
                      )
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                  {diagnosticResults && (
                    <p className="text-sm text-muted-foreground">
                      Compliance: {diagnosticResults.sla.compliance}%
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={handleCheckSlaCompliance}
                  >
                    Check SLA
                  </Button>
                </Card>

                <Card className="p-4 border-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">System Health</span>
                    {diagnosticResults ? (
                      <Badge className="bg-green-500/10 text-green-600">Pass</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All checks complete
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={handleRunDiagnostics}
                  >
                    Run Diagnostics
                  </Button>
                </Card>
              </div>

              {diagnosticResults && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Diagnostic History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Network Latency</TableCell>
                        <TableCell><Badge className="bg-green-500/10 text-green-600">Pass</Badge></TableCell>
                        <TableCell>{diagnosticResults.network.latency}ms</TableCell>
                        <TableCell className="text-muted-foreground">{formatTimestamp(Date.now())}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SLA Compliance</TableCell>
                        <TableCell><Badge className="bg-green-500/10 text-green-600">Pass</Badge></TableCell>
                        <TableCell>{diagnosticResults.sla.compliance}%</TableCell>
                        <TableCell className="text-muted-foreground">{formatTimestamp(Date.now())}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Node Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-2">
                  {MOCK_LOGS.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${LOG_LEVEL_COLORS[log.level]}`}
                      >
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-sm flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skill Whitelist Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Whitelist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select which skills your node is allowed to use. Only approved skills will be available for sessions.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_SKILLS.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs text-muted-foreground">{skill.description}</div>
                    </div>
                    <Switch
                      checked={skillWhitelist.includes(skill.id)}
                      onCheckedChange={() => handleToggleSkill(skill.id)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button>Save Skill Whitelist</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Node Update/Restart Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Node Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleRestartNode}>
              Restart Node
            </Button>
            <Button variant="outline">
              Check for Updates
            </Button>
            <Button variant="outline">
              Apply Update
            </Button>
          </div>
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