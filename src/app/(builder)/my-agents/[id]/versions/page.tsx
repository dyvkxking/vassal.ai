"use client"

import { useState, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

// Mock agent data
const mockAgents = [
  { id: "agent-1", name: "Customer Support Agent", status: "active" },
  { id: "agent-2", name: "Sales Assistant", status: "active" },
  { id: "agent-3", name: "Technical Support Bot", status: "inactive" },
]

// Version history data
const versionHistory = [
  {
    id: "v-1.3.5",
    version: "1.3.5",
    date: "2026-06-01",
    status: "active",
    changelog: "Improved refund request handling with better eligibility checking",
    signalsApplied: 24,
    qualityImprovement: "+3%",
    activatedBy: "System",
  },
  {
    id: "v-1.3.4",
    version: "1.3.4",
    date: "2026-05-28",
    status: "inactive",
    changelog: "Added context preservation for multi-turn conversations",
    signalsApplied: 18,
    qualityImprovement: "+2.5%",
    activatedBy: "Builder",
  },
  {
    id: "v-1.3.3",
    version: "1.3.3",
    date: "2026-05-21",
    status: "inactive",
    changelog: "Fixed rate limiting edge cases and added retry logic",
    signalsApplied: 31,
    qualityImprovement: "+4%",
    activatedBy: "Builder",
  },
  {
    id: "v-1.3.2",
    version: "1.3.2",
    date: "2026-05-14",
    status: "inactive",
    changelog: "Enhanced error message clarity for better user experience",
    signalsApplied: 15,
    qualityImprovement: "+2%",
    activatedBy: "System",
  },
  {
    id: "v-1.3.1",
    version: "1.3.1",
    date: "2026-05-07",
    status: "inactive",
    changelog: "Improved API timeout handling and fallback responses",
    signalsApplied: 22,
    qualityImprovement: "+3.5%",
    activatedBy: "Builder",
  },
  {
    id: "v-1.3.0",
    version: "1.3.0",
    date: "2026-04-30",
    status: "inactive",
    changelog: "Major release: Added support for multi-language queries",
    signalsApplied: 45,
    qualityImprovement: "+8%",
    activatedBy: "Builder",
  },
  {
    id: "v-1.2.9",
    version: "1.2.9",
    date: "2026-04-23",
    status: "inactive",
    changelog: "Bug fix: Session state corruption in long-running conversations",
    signalsApplied: 8,
    qualityImprovement: "+1%",
    activatedBy: "System",
  },
  {
    id: "v-1.2.8",
    version: "1.2.8",
    date: "2026-04-16",
    status: "inactive",
    changelog: "Optimized prompt templates for better token efficiency",
    signalsApplied: 12,
    qualityImprovement: "+2%",
    activatedBy: "Builder",
  },
]

// Status badge component
function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={status === "active" ? "default" : "secondary"}
      className={status === "active" ? "bg-emerald-100 text-emerald-700" : ""}
    >
      {status === "active" ? "Active" : "Inactive"}
    </Badge>
  )
}

// Version comparison
function VersionCompare({ v1, v2 }: { v1: string; v2: string }) {
  const ver1 = versionHistory.find((v) => v.version === v1)
  const ver2 = versionHistory.find((v) => v.version === v2)

  if (!ver1 || !ver2) return null

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Version {v1}</div>
        <div className="text-lg font-bold">{ver1.qualityImprovement}</div>
        <div className="text-xs text-muted-foreground">Quality change</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">Version {v2}</div>
        <div className="text-lg font-bold">{ver2.qualityImprovement}</div>
        <div className="text-xs text-muted-foreground">Quality change</div>
      </div>
    </div>
  )
}

export default function AgentVersionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [showNewVersionDialog, setShowNewVersionDialog] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [versionToDeactivate, setVersionToDeactivate] = useState<string | null>(null)
  const [changelog, setChangelog] = useState("")

  // Find agent - default to agent-1 if id not found
  const agent = mockAgents.find((a) => a.id === id) ?? mockAgents[0]
  const activeVersion = versionHistory.find((v) => v.status === "active")

  const handleDeactivate = () => {
    console.log("Deactivating version:", versionToDeactivate)
    setShowDeactivateDialog(false)
    setVersionToDeactivate(null)
  }

  const handleCreateVersion = () => {
    console.log("Creating new version with changelog:", changelog)
    setShowNewVersionDialog(false)
    setChangelog("")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <a href="/my-agents" className="hover:underline">My Agents</a>
          <span>/</span>
          <span>{agent.name}</span>
          <span>/</span>
          <span>Versions</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="text-lg">
                {agent.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{agent.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                  {agent.status}
                </Badge>
                <span className="text-sm text-muted-foreground">Version History</span>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowNewVersionDialog(true)}>
            Create New Version
          </Button>
        </div>
      </div>

      {/* Active Version Summary */}
      {activeVersion && (
        <Card className="mb-8 border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Version</span>
              <Badge variant="default" className="bg-emerald-100 text-emerald-700">
                {activeVersion.version}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold">{activeVersion.version}</div>
                <div className="text-xs text-muted-foreground">Version Number</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold">{activeVersion.date}</div>
                <div className="text-xs text-muted-foreground">Activated Date</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold">{activeVersion.signalsApplied}</div>
                <div className="text-xs text-muted-foreground">Signals Applied</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-emerald-600">{activeVersion.qualityImprovement}</div>
                <div className="text-xs text-muted-foreground">Quality Improvement</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="text-sm font-medium mb-2">Changelog</div>
              <div className="text-sm text-muted-foreground">{activeVersion.changelog}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Activated by: <span className="font-medium">{activeVersion.activatedBy}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/my-agents/${id}/learning`}>View Learning</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/analytics?agent=${id}`}>View Analytics</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Changelog</TableHead>
                <TableHead>Signals</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Activated By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versionHistory.map((version) => (
                <TableRow key={version.id} className={version.status === "active" ? "bg-emerald-50/50" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{version.version}</span>
                      {version.status === "active" && (
                        <Badge variant="default" className="text-xs bg-emerald-100 text-emerald-700">
                          Active
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{version.date}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={version.status} />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[250px]">
                      <span className="text-sm truncate block">{version.changelog}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{version.signalsApplied}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-emerald-100 text-emerald-700">
                      {version.qualityImprovement}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{version.activatedBy}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <a href={`/my-agents/${id}/versions/${version.version}`}>View Details</a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/analytics?agent=${id}&version=${version.version}`}>View Analytics</a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setVersionToDeactivate(version.version)
                              setShowDeactivateDialog(true)
                            }}
                            className="text-destructive"
                            disabled={version.status === "inactive"}
                          >
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create New Version Dialog */}
      <Dialog open={showNewVersionDialog} onOpenChange={setShowNewVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              Create a new agent version based on the latest approved learning signals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-2">Current Active Version</div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {activeVersion?.version}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {activeVersion?.signalsApplied} signals applied
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Changelog</label>
              <Textarea
                placeholder="Describe the changes in this version..."
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-2">Preview</div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">New version</span>
                  <div className="text-lg font-bold">v1.3.6</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Signals to apply</span>
                  <div className="text-lg font-bold">15</div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewVersionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVersion} disabled={!changelog.trim()}>
              Create Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Version Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate version {versionToDeactivate}? This will not affect current sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <VersionCompare v1={versionToDeactivate ?? ""} v2={activeVersion?.version ?? ""} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeactivate}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}