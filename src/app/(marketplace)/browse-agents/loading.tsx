import { Skeleton } from '@/components/ui/skeleton'
import { AgentCardSkeleton } from '@/components/shared/agent-card-skeleton'
import { SectionSkeleton } from '@/components/shared/section-skeleton'

export default function BrowseAgentsLoadingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
      </div>

      <div className="container flex-1 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="hidden w-[280px] shrink-0 md:block">
            <div className="sticky top-24 space-y-4">
              <Skeleton className="h-6 w-24 mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 md:hidden" />
              <Skeleton className="h-10 w-64 max-w-xs" />
              <div className="flex-1" />
              <Skeleton className="h-10 w-[180px]" />
            </div>

            {/* Agent Grid */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <AgentCardSkeleton key={i} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}