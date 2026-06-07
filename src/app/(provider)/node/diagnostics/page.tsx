'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Play } from 'lucide-react'

type DiagnosticStatus = 'pass' | 'warn' | 'fail' | 'pending'

interface DiagnosticTest {
  id: string
  name: string
  description: string
  status: DiagnosticStatus
  result?: string
  timestamp?: number
  progress?: number
}

interface DiagnosticHistoryEntry {
  id: string
  testName: string
  status: DiagnosticStatus
  result: string
  timestamp: number
}

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

function getStatusIcon(status: DiagnosticStatus) {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="size-5 text-green-600" />
    case 'warn':
      return <AlertTriangle className="size-5 text-yellow-600" />
    case 'fail':
      return <XCircle className="size-5 text-red-600" />
    default:
      return <div className="size-5 rounded-full border-2 border-muted-foreground/30" />
  }
}

function getStatusBadge(status: DiagnosticStatus) {
  switch (status) {
    case 'pass':
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Pass</Badge>
    case 'warn':
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Warning</Badge>
    case 'fail':
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Fail</Badge>
    default:
      return <Badge variant="outline">Pending</Badge>
  }
}

export default function NodeDiagnosticsPage() {
  const [tests, setTests] = useState<DiagnosticTest[]>([
    {
      id: 'network',
      name: 'Network Latency',
      description: 'Test network connectivity and latency to peers',
      status: 'pending',
    },
    {
      id: 'sla',
      name: 'SLA Compliance',
      description: 'Check historical SLA compliance rate',
      status: 'pending',
    },
    {
      id: 'disk',
      name: 'Disk Space',
      description: 'Check available disk space',
      status: 'pending',
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      description: 'Check RAM utilization',
      status: 'pending',
    },
    {
      id: 'cpu',
      name: 'CPU Load',
      description: 'Check CPU utilization and load',
      status: 'pending',
    },
  ])
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [history, setHistory] = useState<DiagnosticHistoryEntry[]>([
    {
      id: 'hist-1',
      testName: 'Network Latency',
      status: 'pass',
      result: '45ms',
      timestamp: Date.now() - 3600000,
    },
    {
      id: 'hist-2',
      testName: 'SLA Compliance',
      status: 'pass',
      result: '99.4%',
      timestamp: Date.now() - 3600000,
    },
    {
      id: 'hist-3',
      testName: 'Disk Space',
      status: 'pass',
      result: '1800GB available',
      timestamp: Date.now() - 7200000,
    },
    {
      id: 'hist-4',
      testName: 'Memory Usage',
      status: 'warn',
      result: '78% utilized',
      timestamp: Date.now() - 10800000,
    },
    {
      id: 'hist-5',
      testName: 'CPU Load',
      status: 'pass',
      result: '45%',
      timestamp: Date.now() - 14400000,
    },
  ])
  const [alerts, setAlerts] = useState<{ id: string; type: 'warning' | 'error'; message: string }[]>([
    {
      id: 'alert-1',
      type: 'warning',
      message: 'Memory usage has been above 75% for the last 30 minutes',
    },
  ])

  const runDiagnostic = async (testId: string) => {
    setTests(prev =>
      prev.map(test =>
        test.id === testId
          ? { ...test, status: 'pending' as DiagnosticStatus, progress: 0 }
          : test
      )
    )

    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockResults: Record<string, { status: DiagnosticStatus; result: string }> = {
      network: { status: 'pass', result: '45ms' },
      sla: { status: 'pass', result: '99.4%' },
      disk: { status: 'pass', result: '1800GB available' },
      memory: { status: 'warn', result: '78% utilized' },
      cpu: { status: 'pass', result: '45% load' },
    }

    const result = mockResults[testId] || { status: 'pass' as DiagnosticStatus, result: 'OK' }

    setTests(prev =>
      prev.map(test =>
        test.id === testId
          ? { ...test, status: result.status, result: result.result, timestamp: Date.now(), progress: undefined }
          : test
      )
    )

    setHistory(prev => [
      {
        id: `hist-${Date.now()}`,
        testName: tests.find(t => t.id === testId)?.name || testId,
        status: result.status,
        result: result.result,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 19),
    ])

    if (result.status === 'warn') {
      setAlerts(prev => [
        ...prev,
        {
          id: `alert-${Date.now()}`,
          type: 'warning',
          message: `${tests.find(t => t.id === testId)?.name} returned a warning: ${result.result}`,
        },
      ])
    } else if (result.status === 'fail') {
      setAlerts(prev => [
        ...prev,
        {
          id: `alert-${Date.now()}`,
          type: 'error',
          message: `${tests.find(t => t.id === testId)?.name} failed: ${result.result}`,
        },
      ])
    }
  }

  const runAllDiagnostics = async () => {
    setIsRunningAll(true)
    for (const test of tests) {
      await runDiagnostic(test.id)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    setIsRunningAll(false)
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Node Diagnostics</h1>
        <p className="text-muted-foreground mt-1">
          Run diagnostic tests to check your node health and performance
        </p>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'} className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="size-5 text-yellow-600 mt-0.5" />
                ) : (
                  <XCircle className="size-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <AlertTitle>{alert.type === 'error' ? 'Error' : 'Warning'}</AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                Dismiss
              </Button>
            </Alert>
          ))}
        </div>
      )}

      {/* Run All Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Run All Diagnostics</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Run all diagnostic tests to check node health
              </p>
            </div>
            <Button
              onClick={runAllDiagnostics}
              disabled={isRunningAll}
            >
              {isRunningAll ? (
                <>
                  <RefreshCw className="size-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="size-4 mr-2" />
                  Run All
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostic Test Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <Card key={test.id} className={test.status === 'fail' ? 'border-red-200' : test.status === 'warn' ? 'border-yellow-200' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{test.name}</CardTitle>
                {getStatusIcon(test.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{test.description}</p>

              {test.progress !== undefined && (
                <Progress value={test.progress} className="h-2" />
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(test.status)}
                </div>

                {test.result && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Result</span>
                    <span className="text-sm text-muted-foreground">{test.result}</span>
                  </div>
                )}

                {test.timestamp && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Run</span>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(test.timestamp)}</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => runDiagnostic(test.id)}
                disabled={test.status === 'pending'}
              >
                {test.status === 'pending' ? 'Running...' : 'Run Test'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historical Results */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.testName}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>{entry.result}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatTimestamp(entry.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {history.length === 0 && (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              No diagnostic history available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}