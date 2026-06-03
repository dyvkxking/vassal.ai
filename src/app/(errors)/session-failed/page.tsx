import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SessionFailedPage() {
  const reason = "Authentication token expired. Please sign in again."

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="text-6xl mb-6">🔐</div>

      <h1 className="text-4xl font-bold mb-4">Session Failed</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Unable to Establish Session</CardTitle>
          <CardDescription>
            There was a problem starting your session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-destructive">Reason</p>
            <p className="text-muted-foreground">{reason}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            This may happen if your session expired or there was a connection issue.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button variant="default">
          <Link href="/onboarding/wallet-connect">Try Again</Link>
        </Button>
        <Button variant="outline">
          <Link href="/session-history">View Session History</Link>
        </Button>
      </div>
    </div>
  )
}