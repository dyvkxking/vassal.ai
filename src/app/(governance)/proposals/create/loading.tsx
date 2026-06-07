import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CreateProposalLoadingPage() {
  return (
    <div className="container max-w-3xl mx-auto py-10">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-2 w-full mt-4" />
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Proposal Type Selection */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Title & Summary */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Specification */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-48 w-full" />
          </div>

          {/* Implementation Plan */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-48 w-full" />
          </div>

          {/* Vote Timing */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Review Section */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>

        <CardContent className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>

      {/* Preview Skeleton */}
      <Card className="mt-6">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}