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
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mockVersionHistory = [
  { version: "1.2.4", date: "2026-05-15", status: "current" },
  { version: "1.2.3", date: "2026-04-28", status: "previous" },
  { version: "1.2.2", date: "2026-04-10", status: "older" },
  { version: "1.2.1", date: "2026-03-22", status: "older" },
]

export default function CLUpdatePage() {
  const [currentVersion] = useState("1.2.4")
  const [isChecking, setIsChecking] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)

  const handleCheckForUpdates = async () => {
    setIsChecking(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsChecking(false)
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setUpdateProgress(i)
    }
    setIsUpdating(false)
    setUpdateAvailable(false)
  }

  const handleRollback = async (version: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Rolled back to version ${version}`)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">CLI Update</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your Node CLI installation and updates
        </p>
      </div>

      <div className="space-y-8">
        {/* Current Version */}
        <Card>
          <CardHeader>
            <CardTitle>Current Version</CardTitle>
            <CardDescription>Your installed Node CLI version</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Installed Version</p>
                <p className="text-4xl font-mono font-bold">{currentVersion}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleCheckForUpdates}
                disabled={isChecking}
              >
                {isChecking ? "Checking..." : "Check for Updates"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Update Available */}
        {updateAvailable && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">
                  Update Available
                </span>
                <CardTitle>Version 1.2.5</CardTitle>
              </div>
              <CardDescription>New features and improvements are available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium mb-2">Changelog</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Improved node heartbeat stability and reliability</li>
                  <li>Reduced memory usage by 15% under heavy load</li>
                  <li>Enhanced error reporting for network connectivity issues</li>
                  <li>Better GPU utilization metrics and reporting</li>
                  <li>Fixed occasional race condition in task scheduling</li>
                  <li>Updated dependencies for security patches</li>
                </ul>
              </div>

              {isUpdating ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Downloading and installing update...</span>
                    <span>{updateProgress}%</span>
                  </div>
                  <Progress value={updateProgress} />
                  <Button variant="outline" disabled className="mt-2">
                    Cancel Update
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleUpdate}>Update Now</Button>
                  <Button variant="outline">Schedule Update</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Version History / Rollback */}
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
            <CardDescription>View past versions and rollback if needed</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Installed Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVersionHistory.map((entry) => (
                  <TableRow key={entry.version}>
                    <TableCell className="font-mono font-medium">{entry.version}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.date}</TableCell>
                    <TableCell>
                      {entry.status === "current" ? (
                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">Current</span>
                      ) : entry.status === "previous" ? (
                        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-600">Previous</span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">Older</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.status !== "current" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRollback(entry.version)}
                        >
                          Rollback
                        </Button>
                      )}
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