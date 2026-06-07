import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function AgentDetailLoadingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-3/4 max-w-2xl" />
            </div>
            <div className="hidden md:flex flex-col gap-2 min-w-[140px]">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-5 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-24 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - stats */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}