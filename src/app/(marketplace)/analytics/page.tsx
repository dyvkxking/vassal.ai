import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  MOCK_AGENTS,
  MOCK_CATEGORY_BREAKDOWN,
  MOCK_PRICING_TRENDS,
  MOCK_TPM_DISTRIBUTION,
  MOCK_QUALITY_DISTRIBUTION,
} from '@/lib/mock-data'

function PricingTrendChart({ data }: { data: { date: string; avgPrice: number }[] }) {
  const maxPrice = Math.max(...data.map((d) => d.avgPrice))
  const minPrice = Math.min(...data.map((d) => d.avgPrice))
  const range = maxPrice - minPrice || 0.01

  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((item, i) => {
        const height = Math.round(((item.avgPrice - minPrice) / range) * 10) + 2
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-xs">${item.avgPrice.toFixed(3)}</span>
            <div className="flex flex-col-reverse">
              {Array.from({ length: height }).map((_, j) => (
                <span key={j} className="text-primary">█</span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{item.date.split('-')[1]}/{item.date.split('-')[2]}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function AnalyticsPage() {
  const totalAgents = MOCK_AGENTS.length
  const avgPrice = MOCK_AGENTS.reduce((sum, a) => sum + a.pricePerMinute, 0) / MOCK_AGENTS.length
  const avgQuality = MOCK_AGENTS.reduce((sum, a) => sum + a.qualityScore, 0) / MOCK_AGENTS.length

  const tpmData = MOCK_TPM_DISTRIBUTION.map((d) => ({
    label: d.range,
    value: d.count,
  }))

  const qualityData = MOCK_QUALITY_DISTRIBUTION.map((d) => ({
    label: d.range,
    value: d.count,
  }))

  const trendingAgents = [...MOCK_AGENTS]
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5)

  const newListings = MOCK_AGENTS
    .filter((a) => {
      const created = new Date(a.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return created >= weekAgo
    })
    .slice(0, 4)

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace Analytics</h1>
        <Badge variant="secondary">Live Data</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Agents Listed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {MOCK_AGENTS.filter((a) => a.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${avgPrice.toFixed(3)}<span className="text-sm font-normal">/min</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              ${(avgPrice * 60).toFixed(2)}/hour avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgQuality.toFixed(2)}<span className="text-sm font-normal">/5.0</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {MOCK_AGENTS.length} agents
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>TPM Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-around gap-4">
              {MOCK_TPM_DISTRIBUTION.map((item, i) => {
                const maxCount = Math.max(...MOCK_TPM_DISTRIBUTION.map((d) => d.count))
                const height = Math.round((item.count / maxCount) * 10)
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="flex flex-col-reverse items-end">
                      {Array.from({ length: height }).map((_, j) => (
                        <span key={j} className="text-blue-600">█</span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground rotate-45 origin-top-left whitespace-nowrap">{item.range}</span>
                    <span className="text-xs font-medium">{item.count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-around gap-4">
              {MOCK_QUALITY_DISTRIBUTION.map((item, i) => {
                const maxCount = Math.max(...MOCK_QUALITY_DISTRIBUTION.map((d) => d.count))
                const height = Math.round((item.count / maxCount) * 10)
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="flex flex-col-reverse items-end">
                      {Array.from({ length: height }).map((_, j) => (
                        <span key={j} className="text-emerald-600">█</span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground rotate-45 origin-top-left whitespace-nowrap">{item.range}</span>
                    <span className="text-xs font-medium">{item.count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Average Pricing Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingTrendChart data={MOCK_PRICING_TRENDS} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Agents</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Avg Quality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CATEGORY_BREAKDOWN.map((cat) => (
                <TableRow key={cat.category}>
                  <TableCell className="font-medium">{cat.category}</TableCell>
                  <TableCell className="text-right">{cat.count}</TableCell>
                  <TableCell className="text-right">${cat.avgPrice.toFixed(3)}/min</TableCell>
                  <TableCell className="text-right">{cat.avgQuality.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trending Agents (Top 5 by Sessions)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Sessions</TableHead>
                <TableHead className="text-right">Quality</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trendingAgents.map((agent, i) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">#{i + 1}</span>
                      {agent.name}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{agent.category}</Badge></TableCell>
                  <TableCell className="text-right">{agent.sessions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{agent.qualityScore.toFixed(1)}</TableCell>
                  <TableCell className="text-right">${agent.pricePerMinute.toFixed(3)}/min</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Listings This Week</CardTitle>
        </CardHeader>
        <CardContent>
          {newListings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No new listings this week</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {newListings.map((agent) => (
                <div key={agent.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{agent.name}</span>
                    <Badge variant={agent.isAvailable ? 'default' : 'secondary'}>
                      {agent.isAvailable ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{agent.category}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Quality</span>
                    <span className="font-medium">{agent.qualityScore.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Price</span>
                    <span className="font-medium">${agent.pricePerMinute.toFixed(3)}/min</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}