import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function HowItWorksLoadingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-muted/30">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <div className="flex gap-4 justify-center pt-4">
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container">
          <Skeleton className="h-8 w-48 mx-auto mb-12" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-border bg-muted/30">
        <div className="container">
          <Skeleton className="h-8 w-56 mx-auto mb-12" />
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <Skeleton className="h-8 w-32 mx-auto mb-12" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border bg-muted/30">
        <div className="container text-center">
          <Skeleton className="h-8 w-56 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto mb-8" />
          <Skeleton className="h-11 w-40 mx-auto" />
        </div>
      </section>
    </div>
  )
}