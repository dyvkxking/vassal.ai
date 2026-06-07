import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function AgentChipSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-10 rounded" />
    </div>
  )
}

function MetricCardSkeleton() {
  return (
    <Card className="p-4 text-center">
      <Skeleton className="h-8 w-16 mx-auto mb-2" />
      <Skeleton className="h-3 w-12 mx-auto" />
    </Card>
  )
}

function ComparisonTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <div className="flex-1 flex gap-4 justify-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CapabilityCardSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CompareLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <AgentChipSkeleton key={i} />
            ))}
            <Skeleton className="h-8 w-28 rounded-full border border-dashed" />
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>

        {/* Comparison Table */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sla">SLA Params</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ComparisonTableSkeleton />
          </TabsContent>

          <TabsContent value="sla">
            <ComparisonTableSkeleton />
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capabilities">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <CapabilityCardSkeleton key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}