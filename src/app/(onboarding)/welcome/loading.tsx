import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function WelcomeLoadingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-4">
          <Skeleton className="h-8 w-32" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-full max-w-lg mx-auto" />
            <Skeleton className="h-6 w-4/5 max-w-md mx-auto" />
          </div>

          {/* Role Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="relative overflow-hidden">
                <div className="h-1 bg-muted" />
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="pt-2">
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-2 w-2 rounded-full" />
                {i < 3 && <Skeleton className="h-0.5 w-8" />}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </footer>
    </div>
  )
}