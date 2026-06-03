import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function BuilderPage() {
  // Mock data for Genesis Builder status
  const daysRemaining = 45
  const freeListingUsed = 1
  const freeListingLimit = 3
  const feeWaiverActive = true

  const requirements = [
    { name: "Create at least 1 functional agent", completed: true },
    { name: "Add accurate descriptions and specs", completed: true },
    { name: "Set competitive pricing", completed: false, remaining: "Set pricing" },
    { name: "Connect to testnet for validation", completed: false, remaining: "Connect" },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Genesis Builder Portal</h1>
        <p className="text-muted-foreground">
          Manage your free listings and agent submissions
        </p>
      </div>

      {/* Free Listing Status */}
      <Card className="mb-6 border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Free Listing Status</CardTitle>
            <Badge variant={feeWaiverActive ? "default" : "secondary"} className="text-lg px-4 py-1">
              {feeWaiverActive ? "Fee Waiver Active" : "Inactive"}
            </Badge>
          </div>
          <CardDescription>
            Your Genesis fee waiver is currently active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-6 bg-muted rounded-lg">
              <p className="text-4xl font-bold mb-2">{freeListingUsed}/{freeListingLimit}</p>
              <p className="text-sm text-muted-foreground">Free Agent Slots Used</p>
            </div>
            <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary">
              <p className="text-4xl font-bold text-primary mb-2">0%</p>
              <p className="text-sm text-muted-foreground">Platform Fees (Genesis)</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Agent Slots Remaining</span>
              <span>{freeListingLimit - freeListingUsed} of {freeListingLimit}</span>
            </div>
            <Progress value={(freeListingUsed / freeListingLimit) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Fee Waiver Period Countdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fee Waiver Period</CardTitle>
          <CardDescription>
            Time remaining for your Genesis benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-6xl font-bold text-primary mb-2">{daysRemaining}</p>
            <p className="text-xl text-muted-foreground">days remaining</p>
            <Progress value={(daysRemaining / 90) * 100} className="mt-6 max-w-sm mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Genesis ends September 1, 2026</p>
          </div>
        </CardContent>
      </Card>

      {/* Requirements to Maintain Free Listing */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Requirements to Maintain Free Listing</CardTitle>
          <CardDescription>
            Keep your Genesis benefits active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requirements.map((req, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {req.completed ? (
                    <span className="text-green-500 text-xl">✓</span>
                  ) : (
                    <span className="text-yellow-500 text-xl">○</span>
                  )}
                  <span className={req.completed ? "text-foreground" : "text-muted-foreground"}>
                    {req.name}
                  </span>
                </div>
                {req.completed ? (
                  <Badge variant="default">Completed</Badge>
                ) : (
                  <Badge variant="outline">{req.remaining}</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Counter */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Submission Counter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-5xl font-bold text-primary mb-2">
              {freeListingUsed}<span className="text-2xl text-muted-foreground">/{freeListingLimit}</span>
            </p>
            <p className="text-muted-foreground">Free agents submitted</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}