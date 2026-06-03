"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOCK_CONNECTED_TOOLS } from "@/lib/mock-data"

interface OAuthConnection {
  id: string
  name: string
  icon: string
  status: "connected" | "disconnected"
  connectedAt?: string
}

const oauthConnections: OAuthConnection[] = [
  { id: "twitter", name: "Twitter", icon: "🐦", status: "connected", connectedAt: "2026-03-15" },
  { id: "github", name: "GitHub", icon: "🐙", status: "connected", connectedAt: "2026-02-20" },
  { id: "discord", name: "Discord", icon: "🎮", status: "disconnected" },
]

interface AuthorizedContract {
  id: string
  name: string
  permissions: string[]
  connectedAt: string
}

const authorizedContracts: AuthorizedContract[] = [
  { id: "contract-1", name: "Vassal Protocol v2", permissions: ["read", "write"], connectedAt: "2026-05-01" },
  { id: "contract-2", name: "MESH Token", permissions: ["read"], connectedAt: "2026-04-15" },
  { id: "contract-3", name: "Agent Registry", permissions: ["read", "write", "admin"], connectedAt: "2026-03-10" },
]

export default function ConnectedAppsPage() {
  const [tools, setTools] = useState(MOCK_CONNECTED_TOOLS)

  const handleRevokeTool = (toolId: string) => {
    if (confirm("Are you sure you want to disconnect this tool?")) {
      setTools(tools.filter((t) => t.id !== toolId))
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Connected Apps</h1>
      </div>

      {/* OAuth Connections */}
      <Card>
        <CardHeader>
          <CardTitle>OAuth Connections</CardTitle>
          <CardDescription>
            Manage third-party app connections via OAuth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {oauthConnections.map((conn) => (
              <div key={conn.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{conn.icon}</span>
                  <div>
                    <p className="font-medium">{conn.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {conn.status === "connected" ? `Connected ${conn.connectedAt}` : "Not connected"}
                    </p>
                  </div>
                </div>
                {conn.status === "connected" ? (
                  <Button variant="outline" size="sm">Disconnect</Button>
                ) : (
                  <Button size="sm">Connect</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authorized Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Authorized Contracts</CardTitle>
          <CardDescription>
            Smart contracts and dApps that have access to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Connected</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorizedContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {contract.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{contract.connectedAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("Revoke access for this contract?")) {
                          alert("Contract access revoked")
                        }
                      }}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Connected Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Tools</CardTitle>
          <CardDescription>
            External tools and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell className="capitalize">{tool.type}</TableCell>
                  <TableCell>
                    <Badge variant={tool.status === "connected" ? "default" : "secondary"}>
                      {tool.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(tool.lastSync).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeTool(tool.id)}
                    >
                      Disconnect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}