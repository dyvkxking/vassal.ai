import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProviderPage() {
  // Mock data for Genesis Provider status
  const daysRemaining = 45
  const multiplierStatus = "2x Active"
  const baseEarnings = 5234.50
  const bonusEarnings = 5234.50
  const totalEarnings = baseEarnings + bonusEarnings
  const qualificationProgress = 75

  const requirements = [
    { name: "Minimum 1000 TPM processed", completed: true },
    { name: "99%+ uptime guarantee", completed: true },
    { name: "Latency under 200ms SLA", completed: true },
    { name: "Minimum 50 completed sessions", completed: false, remaining: 12 },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Genesis Provider Portal</h1>
        <p className="text-muted-foreground">
          Track your Genesis benefits and eligibility status
        </p>
      </div>

      {/* 2x Multiplier Status Card */}
      <Card className="mb-6 border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>2x Multiplier Status</CardTitle>
            <Badge variant="default" className="text-lg px-4 py-1">{multiplierStatus}</Badge>
          </div>
          <CardDescription>
            Your Genesis multiplier is currently active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">${baseEarnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Base Earnings</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary">
              <p className="text-2xl font-bold text-primary">+${bonusEarnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Genesis Bonus</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genesis Period Countdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Genesis Period</CardTitle>
          <CardDescription>
            Time remaining in the Genesis program
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

      {/* Qualification Requirements */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Qualification Requirements</CardTitle>
          <CardDescription>
            Requirements to maintain your Genesis status
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
                  <Badge variant="secondary">{req.remaining} remaining</Badge>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Qualification Progress</span>
              <span>{qualificationProgress}%</span>
            </div>
            <Progress value={qualificationProgress} />
          </div>
        </CardContent>
      </Card>

      {/* How to Maintain Status */}
      <Card>
        <CardHeader>
          <CardTitle>How to Maintain Genesis Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li>Maintain 99%+ uptime by using reliable infrastructure</li>
            <li>Keep latency under 200ms to meet SLA requirements</li>
            <li>Process at least 1000 TPM monthly to qualify</li>
            <li>Complete minimum 50 sessions per month</li>
            <li>Respond to any system alerts within 24 hours</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}