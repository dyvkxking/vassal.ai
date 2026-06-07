import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wrench, Home, MessageCircle, Globe } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          Soon
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Wrench className="h-10 w-10 text-primary" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">We&apos;ll be back soon!</h1>

      <p className="mb-2 max-w-md text-center text-lg text-muted-foreground">
        We&apos;re currently performing scheduled maintenance.
      </p>

      <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
        Expected return: Within the next hour
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" size="lg" asChild>
          <Link href="https://status.vassal.ai" target="_blank">
            View Status Page
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>

      <div className="mt-12 flex items-center gap-4">
        <p className="text-sm text-muted-foreground">Follow us for updates:</p>
        <div className="flex gap-3">
          <Link
            href="https://twitter.com/vassalai"
            target="_blank"
            className="text-muted-foreground hover:text-primary"
          >
            <Home className="h-5 w-5" />
          </Link>
          <Link
            href="https://discord.gg/vassal"
            target="_blank"
            className="text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Link
            href="https://github.com/vassal-ai"
            target="_blank"
            className="text-muted-foreground hover:text-primary"
          >
            <Globe className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Thanks for your patience! We&apos;re working hard to bring you new features and
            improvements.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}