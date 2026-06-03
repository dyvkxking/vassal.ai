import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Step {
  number: number
  title: string
  description: string
  code?: string
}

const steps: Step[] = [
  {
    number: 1,
    title: "Download the CLI",
    description: "Get the Vassal CLI from our official release page",
    code: "npm install -g @vassal/cli",
  },
  {
    number: 2,
    title: "Install the CLI",
    description: "Install globally using npm",
    code: "npm install -g @vassal/cli",
  },
  {
    number: 3,
    title: "Initialize your node",
    description: "Run the init command to set up your node configuration",
    code: "vassal init",
  },
  {
    number: 4,
    title: "Configure node settings",
    description: "Set your preferred TPM floor, latency threshold, and pricing",
    code: "vassal configure --tpm-floor 1000000 --max-latency 200",
  },
]

export default function CLIInstallationPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Install the Vassal CLI</h1>
        <p className="text-muted-foreground">
          Set up the command-line interface to manage your node
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {steps.map((step) => (
          <Card key={step.number}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                  {step.number}
                </span>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            {step.code && (
              <CardContent>
                <code className="block bg-muted rounded p-3 text-sm font-mono overflow-x-auto">
                  {step.code}
                </code>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/onboarding/stake-setup">
          <Button variant="outline">Back</Button>
        </Link>
        <Link href="/onboarding/first-session">
          <Button variant="default">Next</Button>
        </Link>
      </div>
    </div>
  )
}