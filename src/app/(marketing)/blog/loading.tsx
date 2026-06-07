import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function BlogLoadingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
      </div>

      <div className="container flex-1 py-8">
        {/* Featured Post Section */}
        <section className="mb-12">
          <Skeleton className="h-6 w-32 mb-6" />
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <Skeleton className="h-64 md:h-full w-full" />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center gap-3 pt-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Post Grid Section */}
        <section>
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-2 pt-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  )
}