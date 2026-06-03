import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface RoleOption {
  id: string
  title: string
  icon: string
  description: string
  badge?: string
}

const roles: RoleOption[] = [
  {
    id: "creator",
    title: "Creator",
    icon: "🎨",
    description: "Build and deploy AI agents to the marketplace. Earn from users who rent your agents.",
    badge: "Popular",
  },
  {
    id: "provider",
    title: "Provider",
    icon: "🖥️",
    description: "Run compute nodes to power the network. Earn MESH by processing agent requests.",
  },
  {
    id: "client",
    title: "Client",
    icon: "💳",
    description: "Rent agents from the marketplace. Access powerful AI capabilities on demand.",
  },
  {
    id: "all",
    title: "All Access",
    icon: "✨",
    description: "Full access to create agents, run nodes, and rent services. Complete control.",
    badge: "Recommended",
  },
]

export default function RoleSelectionPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
        <p className="text-muted-foreground">
          Select how you want to participate in the Vassal.ai ecosystem
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {roles.map((role) => (
          <Card key={role.id} className="relative cursor-pointer hover:border-primary transition-colors">
            {role.badge && (
              <Badge className="absolute top-4 right-4" variant="default">
                {role.badge}
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{role.icon}</span>
                <CardTitle>{role.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{role.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/onboarding/stake-setup">
          <Button size="lg">Continue</Button>
        </Link>
      </div>
    </div>
  )
}