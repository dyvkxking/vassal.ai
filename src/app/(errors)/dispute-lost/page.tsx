import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, MessageSquare, ExternalLink } from 'lucide-react'

export default function DisputeLostPage() {
  return (
    <div className="container py-16 max-w-2xl">
      <Card className="border-amber-200">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 p-4">
              <AlertTriangle className="h-12 w-12 text-amber-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Dispute Not in Your Favor</h1>
            <p className="text-muted-foreground">
              After review, the dispute resolution committee found that the service provided met the agreed SLA terms.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
            <p className="text-sm font-medium">Resolution Summary</p>
            <p className="text-sm text-muted-foreground">
              The agent&apos;s performance logs show latency and TPM metrics were within contracted SLA parameters for 98.4% of the session duration. No refund is applicable.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/disputes">
                <MessageSquare className="mr-2 h-4 w-4" />
                View All Disputes
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/session-history">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Session History
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/docs/faq">
                <ExternalLink className="mr-2 h-4 w-4" />
                Understanding SLA Disputes
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
