'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { Search, Download, Trash2, RefreshCw, Filter } from 'lucide-react'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  message: string
  source?: string
}

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  warn: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-600 border-red-500/20',
  debug: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
}

const LOG_LEVEL_BORDER_COLORS: Record<LogLevel, string> = {
  info: 'border-blue-500/20',
  warn: 'border-yellow-500/20',
  error: 'border-red-500/20',
  debug: 'border-gray-500/20',
}

const generateMockLogs = (): LogEntry[] => {
  const levels: LogLevel[] = ['info', 'warn', 'error', 'debug']
  const messages = [
    'Node started successfully',
    'Heartbeat sent to network',
    'Checking peer connections...',
    'Session assigned: agent-001',
    'High latency detected: 1200ms',
    'TPM usage: 45000/100000',
    'Connection timeout to peer node-002',
    'Reconnected successfully',
    'Session completed: session-001',
    'Garbage collection triggered',
    'Processing request from client 0xclient...1111',
    'SLA check passed: 99.4% compliance',
    'Memory usage: 67%',
    'Disk space available: 1800GB',
    'Network packet loss: 0.1%',
  ]

  return Array.from({ length: 100 }, (_, i) => ({
    id: `log-${i}`,
    timestamp: Date.now() - i * 30000 + Math.random() * 10000,
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    source: Math.random() > 0.5 ? 'node-001' : 'system',
  })).sort((a, b) => b.timestamp - a.timestamp)
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

function formatFileTimestamp(): string {
  const date = new Date()
  return date.toISOString().replace(/[:.]/g, '-')
}

export default function NodeLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all')
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | 'all'>('all')

  useEffect(() => {
    const initialLogs = generateMockLogs()
    setLogs(initialLogs)
    setFilteredLogs(initialLogs)
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        level: ['info', 'warn', 'error', 'debug'][Math.floor(Math.random() * 4)] as LogLevel,
        message: [
          'Heartbeat sent',
          'New session started',
          'TPM threshold reached',
          'Connection established',
          'Health check passed',
        ][Math.floor(Math.random() * 5)],
        source: 'node-001',
      }

      setLogs(prev => [newLog, ...prev].slice(0, 200))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  useEffect(() => {
    let result = logs

    if (levelFilter !== 'all') {
      result = result.filter(log => log.level === levelFilter)
    }

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      result = result.filter(log => log.message.toLowerCase().includes(keyword))
    }

    if (timeRange !== 'all') {
      const now = Date.now()
      const rangeMs = {
        '1h': 3600000,
        '6h': 21600000,
        '24h': 86400000,
      }[timeRange]
      result = result.filter(log => now - log.timestamp < rangeMs)
    }

    setFilteredLogs(result)
  }, [logs, levelFilter, searchKeyword, timeRange])

  const handleExportLogs = () => {
    const content = filteredLogs
      .map(log => `[${formatTimestamp(log.timestamp)}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `node-logs-${formatFileTimestamp()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearLogs = () => {
    setLogs([])
    setFilteredLogs([])
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Node Logs</h1>
        <p className="text-muted-foreground mt-1">
          View and analyze logs from your provider node
        </p>
      </div>

      {/* Log Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as LogLevel | 'all')}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>
            </div>

            {/* Time Range */}
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '1h' | '6h' | '24h' | 'all')}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="1h">Last 1 hour</option>
                <option value="6h">Last 6 hours</option>
                <option value="24h">Last 24 hours</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Auto-refresh</span>
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredLogs.length} logs
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportLogs}>
                <Download className="size-4 mr-2" />
                Export
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="size-4 mr-2" />
                    Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all logs?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all logs from your view. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearLogs}>
                      Clear Logs
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Log Entries</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newLogs = generateMockLogs()
                setLogs(newLogs)
              }}
            >
              <RefreshCw className="size-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 bg-background z-10">
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[120px]">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${LOG_LEVEL_COLORS[log.level]} ${LOG_LEVEL_BORDER_COLORS[log.level]}`}
                      >
                        {log.level.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.message}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {log.source}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredLogs.length === 0 && (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No logs match your filters
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}