import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, AlertTriangle, XCircle, Mail, MessageCircle, Clock, ExternalLink } from 'lucide-react'

const SERVICES: { name: string; status: "operational" | "degraded" | "outage"; uptime: number }[] = [
  { name: "Marketplace", status: "operational", uptime: 99.99 },
  { name: "Provider Portal", status: "operational", uptime: 99.95 },
  { name: "Builder Portal", status: "operational", uptime: 99.98 },
  { name: "Session Engine", status: "operational", uptime: 99.99 },
  { name: "Staking", status: "degraded", uptime: 99.50 },
  { name: "Governance", status: "operational", uptime: 100.00 },
]

const INCIDENTS = [
  {
    id: "INC-2024-042",
    date: "2024-11-28",
    title: "Elevated latency on Session Engine",
    status: "resolved" as const,
    duration: "23 min",
  },
  {
    id: "INC-2024-041",
    date: "2024-11-15",
    title: "ArrowRightvernance voting delays",
    status: "resolved" as const,
    duration: "45 min",
  },
  {
    id: "INC-2024-040",
    date: "2024-11-02",
    title: "Staking smart contract slow responses",
    status: "resolved" as const,
    duration: "1h 12 min",
  },
  {
    id: "INC-2024-039",
    date: "2024-10-18",
    title: "Marketplace API intermittent timeouts",
    status: "resolved" as const,
    duration: "18 min",
  },
]

const STATUS_CONFIG = {
  operational: {
    label: "All Systems Operational",
    badge: "default" as const,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
  },
  degraded: {
    label: "Degraded Performance",
    badge: "secondary" as const,
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
  },
  outage: {
    label: "Major Outage",
    badge: "destructive" as const,
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
  },
}

function ServiceStatusBadge({ status }: { status: "operational" | "degraded" | "outage" }) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant={config.badge} className={status === "degraded" ? "bg-amber-500" : undefined}>
      <config.icon className="h-3 w-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function StatusPage() {
  const overallStatus = SERVICES.every((s) => s.status === "operational")
    ? "operational"
    : SERVICES.some((s) => s.status === "outage")
    ? "outage"
    : "degraded"

  const overallConfig = STATUS_CONFIG[overallStatus]

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">System Status</h1>
          <p className="text-muted-foreground">Real-time status of vassal.ai infrastructure</p>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${overallConfig.bgColor}`}>
                <overallConfig.icon className={`h-8 w-8 ${overallConfig.color}`} />
              </div>
              <h2 className="text-2xl font-semibold mb-1">{overallConfig.label}</h2>
              <p className="text-muted-foreground text-sm">
                {overallStatus === "operational"
                  ? "All systems are functioning normally"
                  : overallStatus === "degraded"
                  ? "Some systems are experiencing reduced performance"
                  : "Critical systems are currently unavailable"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Services Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SERVICES.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {service.status === "operational" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : service.status === "degraded" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Uptime (30d): {service.uptime}%
                      </p>
                    </div>
                  </div>
                  <ServiceStatusBadge status={service.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incident History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Incident History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Incident</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INCIDENTS.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="text-muted-foreground">{incident.date}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{incident.title}</p>
                        <p className="text-xs text-muted-foreground">{incident.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{incident.duration}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                        {incident.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Subscribe to Updates */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Subscribe to Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when incidents occur or systems recover
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="mailto:status@vassal.ai" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://discord.gg/vassal" target="_blank" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    MessageCircle
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}