"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

type ExportType = "all" | "sessions" | "earnings"

export default function DataPrivacyPage() {
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState<ExportType | null>(null)
  const [exportSuccess, setExportSuccess] = useState<ExportType | null>(null)

  const handleExportData = async (type: ExportType) => {
    setIsExporting(type)
    setExportSuccess(null)
    // Simulate API call and file generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExporting(null)
    setExportSuccess(type)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      return
    }
    // Simulate account deletion
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDeleteDialogOpen(false)
    setDeleteConfirmText("")
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Data & Privacy</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your data export and privacy settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Export Data Section */}
        <Card>
          <CardHeader>
            <CardTitle>Export Your Data</CardTitle>
            <CardDescription>
              Download a copy of your data for GDPR compliance or personal records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Export All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Complete export of all your account data including profile, sessions, and earnings
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleExportData("all")}
                  disabled={isExporting !== null}
                >
                  {isExporting === "all" ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Exporting...
                    </span>
                  ) : exportSuccess === "all" ? (
                    "Downloaded"
                  ) : (
                    "Export All"
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Session History</p>
                  <p className="text-sm text-muted-foreground">
                    Export your conversation and session logs
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleExportData("sessions")}
                  disabled={isExporting !== null}
                >
                  {isExporting === "sessions" ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Exporting...
                    </span>
                  ) : exportSuccess === "sessions" ? (
                    "Downloaded"
                  ) : (
                    "Download"
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Earnings History</p>
                  <p className="text-sm text-muted-foreground">
                    Export your earnings records and transaction history
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleExportData("earnings")}
                  disabled={isExporting !== null}
                >
                  {isExporting === "earnings" ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Exporting...
                    </span>
                  ) : exportSuccess === "earnings" ? (
                    "Downloaded"
                  ) : (
                    "Download"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Information */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Information</CardTitle>
            <CardDescription>
              Your data rights and how we handle your information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                We collect only the data necessary to provide and improve our services.
                Your data is encrypted in transit and at rest.
              </p>
              <p>
                You can request access to your data, correction of any inaccuracies,
                or deletion of your account at any time by contacting our support team.
              </p>
              <p>
                Third-party service providers are contractually bound to protect your
                data and only process it according to our instructions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated data including your session history, earnings, and preferences. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="delete-confirm">Type DELETE to confirm</Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="border-destructive/50"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "DELETE"}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}