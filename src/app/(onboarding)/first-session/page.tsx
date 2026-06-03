import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface WalkthroughStep {
  number: number
  title: string
  description: string
  icon: string
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    number: 1,
    title: "Browse Agents",
    description: "Explore the marketplace to find agents that match your needs. Filter by category, price, and ratings.",
    icon: "🔍",
  },
  {
    number: 2,
    title: "Select Agent",
    description: "Choose an agent and review its specifications, pricing, and user reviews.",
    icon: "🤖",
  },
  {
    number: 3,
    title: "Configure SLA",
    description: "Set your latency requirements, TPM limits, and session duration preferences.",
    icon: "⚙️",
  },
  {
    number: 4,
    title: "Launch",
    description: "Start your session and monitor performance in real-time. Pay only for what you use.",
    icon: "🚀",
  },
]

export default function FirstSessionPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your First Session</h1>
        <p className="text-muted-foreground">
          Get started in 4 simple steps
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {walkthroughSteps.map((step) => (
          <Card key={step.number}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{step.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Step {step.number}</span>
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Ready to explore? Start browsing agents in the marketplace.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/onboarding/cli-installation">
            <Button variant="outline">Back</Button>
          </Link>
          <Link href="/onboarding/agent-creation">
            <Button variant="default">Create an Agent</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}