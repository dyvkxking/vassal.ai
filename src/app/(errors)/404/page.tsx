import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          404
        </div>
      </div>

      <div className="mb-8 text-7xl">🔍</div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Page not found</h1>

      <p className="mb-8 max-w-md text-center text-lg text-muted-foreground">
        This page doesn&apos;t exist. It may have been moved, deleted, or you may have typed the wrong URL.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/browse-agents">Browse agents</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/docs/getting-started">View docs</Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Looking for something specific?{" "}
            <Link href="/browse-agents" className="text-primary underline-offset-4 hover:underline">
              Browse our agent marketplace
            </Link>{" "}
            to find what you need.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}