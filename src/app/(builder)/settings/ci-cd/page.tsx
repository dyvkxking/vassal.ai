"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mockPipeline = [
  { stage: "Build", status: "completed", duration: "2m 34s", timestamp: "2026-06-05T10:30:00" },
  { stage: "Test", status: "completed", duration: "5m 12s", timestamp: "2026-06-05T10:33:00" },
  { stage: "Deploy", status: "in_progress", duration: "-", timestamp: "2026-06-05T10:38:00" },
]

const mockEnvironments = [
  { name: "Production", branch: "main", autoDeploy: true, lastDeploy: "2026-06-05T10:38:00" },
  { name: "Staging", branch: "develop", autoDeploy: true, lastDeploy: "2026-06-04T15:20:00" },
  { name: "Development", branch: "feature/*", autoDeploy: false, lastDeploy: "2026-06-03T09:15:00" },
]

export default function BuilderCICDPage() {
  const [githubConnected, setGlobeConnected] = useState(true)
  const [repoUrl] = useState("https://github.com/example/vassal-agents")
  const [autoDeploy, setAutoDeploy] = useState(true)

  const getStageStatusBadge = (status: string) => {
    if (status === "completed") {
      return <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">Completed</span>
    }
    if (status === "in_progress") {
      return <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-600">In Progress</span>
    }
    return <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">Pending</span>
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">CI/CD Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Configure continuous integration and deployment for your agents
        </p>
      </div>

      <div className="space-y-8">
        {/* Globe Connection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GH</span>
                </div>
                <div>
                  <CardTitle>Globe Repository</CardTitle>
                  <CardDescription>Connect your repository for CI/CD</CardDescription>
                </div>
              </div>
              {githubConnected ? (
                <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">Connected</span>
              ) : (
                <Button variant="outline">Connect Repository</Button>
              )}
            </div>
          </CardHeader>
          {githubConnected && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Repository URL</Label>
                <Input value={repoUrl} readOnly className="font-mono" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Deploy on Agent Update</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically deploy when agents are updated in the repository
                  </p>
                </div>
                <Switch checked={autoDeploy} onCheckedChange={setAutoDeploy} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Configure Webhook</Button>
                <Button variant="outline">Disconnect</Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Test Environment Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Test Environment</CardTitle>
            <CardDescription>
              Configure automated testing before deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Run Tests Before Deploy</Label>
                <p className="text-sm text-muted-foreground">
                  Execute test suite before deploying to production
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="test-cmd">Test Command</Label>
              <Input id="test-cmd" defaultValue="npm run test:ci" placeholder="npm run test" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverage-threshold">Coverage Threshold</Label>
              <Input id="coverage-threshold" type="number" defaultValue="80" placeholder="80" className="max-w-[200px]" />
              <p className="text-xs text-muted-foreground">Minimum coverage percentage required to pass</p>
            </div>
            <Button variant="outline">Save Test Configuration</Button>
          </CardContent>
        </Card>

        {/* Deployment Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Pipeline</CardTitle>
            <CardDescription>Current deployment status and history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Latest Deployment</span>
                <span className="text-muted-foreground">2026-06-05 10:38 AM</span>
              </div>
              <div className="flex items-center gap-2">
                {mockPipeline.map((stage, i) => (
                  <div key={stage.stage} className="flex items-center">
                    <div className={`px-3 py-2 rounded-lg border ${
                      stage.status === "completed" ? "bg-green-500/10 border-green-500/30" :
                      stage.status === "in_progress" ? "bg-blue-500/10 border-blue-500/30" :
                      "bg-muted border-muted"
                    }`}>
                      <p className="text-sm font-medium">{stage.stage}</p>
                      <p className="text-xs text-muted-foreground">{stage.duration}</p>
                    </div>
                    {i < mockPipeline.length - 1 && (
                      <div className="w-8 h-0.5 bg-muted mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPipeline.map((stage) => (
                  <TableRow key={stage.stage}>
                    <TableCell className="font-medium">{stage.stage}</TableCell>
                    <TableCell>{getStageStatusBadge(stage.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{stage.duration}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(stage.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Environments */}
        <Card>
          <CardHeader>
            <CardTitle>Environments</CardTitle>
            <CardDescription>Manage deployment environments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Environment</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Auto-Deploy</TableHead>
                  <TableHead>Last Deploy</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEnvironments.map((env) => (
                  <TableRow key={env.name}>
                    <TableCell className="font-medium">{env.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">{env.branch}</Badge>
                    </TableCell>
                    <TableCell>
                      {env.autoDeploy ? (
                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">Enabled</span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">Disabled</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(env.lastDeploy).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="mr-2">Configure</Button>
                      <Button variant="ghost" size="sm">Deploy Now</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}