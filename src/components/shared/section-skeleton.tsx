import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SectionVariant = 'table' | 'cards' | 'stats' | 'chart' | 'form'

interface SectionSkeletonProps {
  variant?: SectionVariant
  className?: string
}

function TableSectionSkeleton() {
  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b last:border-0 px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CardsSectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
          <Skeleton className="h-4 w-24" />
        </Card>
      ))}
    </div>
  )
}

function StatsSectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ChartSectionSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="flex items-end gap-3 h-32">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-8"
              style={{ height: `${40 + Math.random() * 60}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function FormSectionSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SectionSkeleton({ variant = 'cards', className }: SectionSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {variant === 'table' && <TableSectionSkeleton />}
      {variant === 'cards' && <CardsSectionSkeleton />}
      {variant === 'stats' && <StatsSectionSkeleton />}
      {variant === 'chart' && <ChartSectionSkeleton />}
      {variant === 'form' && <FormSectionSkeleton />}
    </div>
  )
}

export {
  TableSectionSkeleton,
  CardsSectionSkeleton,
  StatsSectionSkeleton,
  ChartSectionSkeleton,
  FormSectionSkeleton,
}