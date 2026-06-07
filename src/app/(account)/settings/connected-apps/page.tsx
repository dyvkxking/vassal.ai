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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ConnectedApp {
  id: string
  name: string
  icon: string
  permissions: string[]
  connectedDate: string
  publisher: string
}

interface ContractAuthorization {
  id: string
  name: string
  description: string
  authorizedDate: string
}

const mockConnectedApps: ConnectedApp[] = [
  {
    id: "1",
    name: "Somnia Wallet",
    icon: "SW",
    permissions: ["View wallet balance", "View transaction history"],
    connectedDate: "2026-03-15",
    publisher: "Somnia Labs",
  },
  {
    id: "2",
    name: "AI Agent Studio",
    icon: "AS",
    permissions: ["Read agent data", "Execute slash commands"],
    connectedDate: "2026-04-20",
    publisher: "AI Studio Inc",
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    icon: "AD",
    permissions: ["Read earnings data", "View proposal statistics"],
    connectedDate: "2026-05-01",
    publisher: "DataCo",
  },
]

const mockContractAuthorizations: ContractAuthorization[] = [
  {
    id: "1",
    name: "Agent Contract v1",
    description: "Standard agent service contract",
    authorizedDate: "2026-01-10",
  },
  {
    id: "2",
    name: "Earnings Pool Contract",
    description: "Pooled earnings distribution contract",
    authorizedDate: "2026-02-28",
  },
]

export default function ConnectedAppsSettingsPage() {
  const [apps, setApps] = useState(mockConnectedApps)
  const [revokeAppId, setRevokeAppId] = useState<string | null>(null)

  const handleRevokeApp = (appId: string) => {
    setApps(apps.filter((app) => app.id !== appId))
    setRevokeAppId(null)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Connected Apps</h1>
        <p className="mt-1 text-muted-foreground">
          Manage applications and services connected to your account
        </p>
      </div>

      <div className="space-y-6">
        {/* Explanation */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              These apps and services can access your account. You can revoke access at any time.
              Revoking will not affect any ongoing transactions or contracts.
            </p>
          </CardContent>
        </Card>

        {/* Connected Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Authorized Applications</CardTitle>
            <CardDescription>
              Applications that have access to your account via OAuth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {apps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No connected applications
              </div>
            ) : (
              apps.map((app) => (
                <div key={app.id} className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-medium">
                      {app.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{app.name}</p>
                        <Badge variant="outline">{app.publisher}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Connected {app.connectedDate}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {app.permissions.map((permission, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRevokeAppId(app.id)}
                  >
                    Revoke
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Contract Authorizations */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Authorizations</CardTitle>
            <CardDescription>
              Smart contracts and agreements you have authorized
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockContractAuthorizations.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{contract.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {contract.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Authorized {contract.authorizedDate}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Contract
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revoke Confirmation Dialog */}
      {revokeAppId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Revoke Application Access?</CardTitle>
              <CardDescription>
                This application will no longer have access to your account.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRevokeAppId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRevokeApp(revokeAppId)}
              >
                Revoke Access
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}