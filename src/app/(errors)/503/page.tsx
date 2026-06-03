import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServiceUnavailablePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="text-6xl mb-6">🔧</div>

      <h1 className="text-4xl font-bold mb-4">Service Unavailable</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Under Maintenance</CardTitle>
          <CardDescription>
            We are currently performing scheduled maintenance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our systems are being upgraded to serve you better. We expect to be back online shortly.
          </p>
          <div className="bg-muted rounded-lg p-4 mb-4">
            <p className="text-sm font-medium">Expected Return</p>
            <p className="text-lg">within 30 minutes</p>
          </div>
          <p className="text-sm text-muted-foreground">
            If you need immediate assistance, please contact our support team.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button variant="default">
          <Link href="/">Return to Home</Link>
        </Button>
        <Button variant="outline">
          <a href="mailto:support@vassal.ai">Contact Support</a>
        </Button>
      </div>
    </div>
  )
}