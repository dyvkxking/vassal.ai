import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MOCK_PROVIDER_NODES, MOCK_SESSIONS } from '@/lib/mock-data'
import { getAgentById } from '@/lib/mock-data'

// Daily earnings data for ASCII chart
const DAILY_EARNINGS = [
  { day: 'Mon', amount: 12 },
  { day: 'Tue', amount: 18 },
  { day: 'Wed', amount: 15 },
  { day: 'Thu', amount: 22 },
  { day: 'Fri', amount: 19 },
  { day: 'Sat', amount: 28 },
  { day: 'Sun', amount: 25 },
]

const MAX_BAR_WIDTH = 20 // max chars for bar

function EarningsBarChart() {
  const maxAmount = Math.max(...DAILY_EARNINGS.map((d) => d.amount))

  return (
    <div className="font-mono text-sm">
      <div className="mb-2 text-xs text-muted-foreground">Daily Earnings (7-day)</div>
      {DAILY_EARNINGS.map(({ day, amount }) => {
        const barLen = Math.round((amount / maxAmount) * MAX_BAR_WIDTH)
        const bar = '█'.repeat(barLen)
        return (
          <div key={day} className="flex items-center gap-2 py-0.5">
            <span className="w-8 text-right text-xs text-muted-foreground">{day}</span>
            <span className="text-primary">{bar}</span>
            <span className="text-xs">${amount}</span>
          </div>
        )
      })}
    </div>
  )
}

function StatCard({
  title,
  value,
  subValue,
  trend,
}: {
  title: string
  value: string
  subValue?: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 text-3xl font-bold">{value}</div>
        {subValue && (
          <div className="mt-1 text-xs text-muted-foreground">
            {trend && (
              <span
                className={
                  trend === 'up'
                    ? 'text-green-600'
                    : trend === 'down'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                }
              >
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
              </span>
            )}
            {subValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ActiveSessionsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Active Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>TPM Used</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>SLA Health</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_SESSIONS.filter((s) => s.status === 'active').length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No active sessions
                </TableCell>
              </TableRow>
            ) : (
              MOCK_SESSIONS.filter((s) => s.status === 'active').map((session) => {
                const agent = getAgentById(session.agentId)
                const tpmPct = Math.round((session.tpmUsed / session.slaParams.tpmCap) * 100)
                const latencyBreaches = session.latencyMetrics.breaches
                const isHealthy = latencyBreaches === 0 && tpmPct < 90

                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {agent?.name ?? session.agentId}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {session.client}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={tpmPct} className="h-2 w-16" />
                        <span className="text-xs text-muted-foreground">
                          {session.tpmUsed.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      ${session.totalCost.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isHealthy
                              ? 'bg-green-500'
                              : latencyBreaches > 0
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                          }`}
                        />
                        <span className="text-xs">
                          {isHealthy
                            ? 'Healthy'
                            : latencyBreaches > 0
                              ? 'Breached'
                              : 'Warning'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" className="h-7 px-2 text-xs">
                        Terminate
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function NodeHealthSidebar() {
  const node = MOCK_PROVIDER_NODES[0]

  // Simulated CPU/Memory usage
  const cpuUsage = 67
  const memUsage = 45

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Node Health</CardTitle>
            {node.isGenesis && (
              <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white">
                Genesis
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-mono">{node.id}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                node.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <span className="text-sm font-medium capitalize">{node.status}</span>
          </div>

          <Separator />

          {/* CPU */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CPU</span>
              <span className="font-mono font-medium">{cpuUsage}%</span>
            </div>
            <Progress value={cpuUsage} className="h-2" />
          </div>

          {/* Memory */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Memory</span>
              <span className="font-mono font-medium">{memUsage}%</span>
            </div>
            <Progress value={memUsage} className="h-2" />
          </div>

          <Separator />

          {/* Hardware */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">GPU</span>
              <span className="font-mono font-medium text-right">
                {node.hardware.gpuModel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">vCPUs</span>
              <span className="font-mono">{node.hardware.cpuCores}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">RAM</span>
              <span className="font-mono">{node.hardware.ramGb} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="font-mono">{node.location}</span>
            </div>
          </div>

          <Separator />

          {/* Last Heartbeat */}
          <div className="text-xs text-muted-foreground">
            <span className="block">Last Heartbeat</span>
            <span className="font-mono text-foreground">
              {new Date(node.lastHeartbeat).toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            Lock More Stake
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Withdraw Earnings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Update Node
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProviderDashboardPage() {
  const primaryNode = MOCK_PROVIDER_NODES[0]
  const activeSessionsCount = MOCK_SESSIONS.filter((s) => s.status === 'active').length
  const totalEarnings = primaryNode.earningsTotal + primaryNode.earningsPending

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your node performance and manage your compute resources.
        </p>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Earnings"
          value={`$${totalEarnings.toFixed(2)}`}
          subValue={`${MOCK_PROVIDER_NODES.length} nodes`}
          trend="up"
        />
        <StatCard
          title="Active Sessions"
          value={activeSessionsCount.toString()}
          subValue="currently running"
          trend="neutral"
        />
        <StatCard
          title="Stake Locked"
          value={`${primaryNode.lockedStake.toLocaleString()} $MESH`}
          subValue={`of ${primaryNode.stakeAmount.toLocaleString()} total`}
          trend="neutral"
        />
        <StatCard
          title="Node Uptime"
          value={`${primaryNode.avgUptime}%`}
          subValue="30-day average"
          trend="up"
        />
      </div>

      {/* Main Content: Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <EarningsBarChart />
            </CardContent>
          </Card>

          {/* Active Sessions Table */}
          <ActiveSessionsTable />
        </div>

        {/* Right column: 1/3 width - Node Health Sidebar */}
        <div className="lg:col-span-1">
          <NodeHealthSidebar />
        </div>
      </div>
    </div>
  )
}