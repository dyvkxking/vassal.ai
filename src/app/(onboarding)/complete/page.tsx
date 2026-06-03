import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ConfigSummary {
  label: string
  value: string
}

const configSummary: ConfigSummary[] = [
  { label: "Role", value: "Provider + Builder" },
  { label: "Stake Amount", value: "500 MESH" },
  { label: "CLI Status", value: "Installed" },
  { label: "Sample Agent", value: "Created" },
]

export default function CompletePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <div className="text-6xl mb-6">🎊</div>

      <h1 className="text-4xl font-bold mb-4">You're All Set!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Welcome to the Vassal.ai Genesis Program
      </p>

      <Card className="mb-8 text-left">
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
          <CardDescription>
            What you've set up during onboarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {configSummary.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Link href="/">
          <Button size="lg" className="w-full">Go to Dashboard</Button>
        </Link>
        <Button variant="outline" className="w-full">
          View Getting Started Guide
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-8">
        Need help? Check our{" "}
        <a href="/docs/getting-started" className="text-primary hover:underline">
          documentation
        </a>{" "}
        or join our{" "}
        <a href="#" className="text-primary hover:underline">
          Discord community
        </a>.
      </p>
    </div>
  )
}