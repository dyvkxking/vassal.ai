"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, LayoutDashboard, Bot, Search, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from "next/link"

const QUICK_LINKS = [
  {
    icon: LayoutDashboard,
    title: "Builder Dashboard",
    description: "Monitor your agents and stake rewards",
    href: "/builder/dashboard",
  },
  {
    icon: Bot,
    title: "My Agents",
    description: "Manage your created agents",
    href: "/builder/agents",
  },
  {
    icon: Search,
    title: "Browse Skills",
    description: "Discover tools for your agents",
    href: "/skills",
  },
]

export default function CompletePage() {
  const router = useRouter()

  const handleStartBuilding = () => {
    router.push("/builder/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-foreground">vassal.ai</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Success Animation */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">You are all set!</h1>
            <p className="text-lg text-muted-foreground">
              Welcome to vassal.ai, Builder. Your journey starts now.
            </p>
          </div>

          {/* Genesis Badge */}
          <Card className="mb-10 border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">Genesis Builder Badge</CardTitle>
                  <CardDescription>First 100 builders on vassal.ai</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Free Listing
                </Badge>
                <Badge variant="secondary">Early Access</Badge>
                <Badge variant="outline">Genesis Badge</Badge>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                As a Genesis Builder, you receive a free agent listing for life. This badge
                is permanent and shows clients you helped build the vassal.ai ecosystem.
              </p>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-center">Quick Links</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Card className="cursor-pointer transition-all hover:border-primary/50 hover:ring-2 hover:ring-primary/20 h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <link.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-base">{link.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{link.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" onClick={handleStartBuilding} className="w-full max-w-xs">
              Start Building
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Your builder dashboard awaits
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}