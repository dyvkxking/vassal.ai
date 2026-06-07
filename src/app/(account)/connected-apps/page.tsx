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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Globe, Shield, Clock, Unlink, CheckCircle2 } from 'lucide-react'

// Mock OAuth connections
const oauthConnections = [
  {
    id: "1",
    name: "DeFi Protocol A",
    type: "OAuth",
    connectedAt: "2024-01-15",
    permissions: ["read:wallet", "read:assets"],
    status: "active",
  },
  {
    id: "2",
    name: "NFT Marketplace",
    type: "OAuth",
    connectedAt: "2024-02-20",
    permissions: ["read:wallet", "write:assets"],
    status: "active",
  },
  {
    id: "3",
    name: "Trading Bot Pro",
    type: "OAuth",
    connectedAt: "2024-03-01",
    permissions: ["read:wallet", "read:assets", "write:trades"],
    status: "active",
  },
]

// Mock authorized contracts
const authorizedContracts = [
  {
    id: "1",
    name: "Staking Contract v2",
    address: "0x1a2b...4c5d",
    type: "Contract",
    authorizedAt: "2024-01-10",
    permissions: ["stake", "unstake"],
    status: "active",
  },
  {
    id: "2",
    name: "Token Swap Router",
    address: "0x6e7f...8g9h",
    type: "Contract",
    authorizedAt: "2024-02-05",
    permissions: ["swap", "approve"],
    status: "active",
  },
  {
    id: "3",
    name: "Yield Farm Pool",
    address: "0x2i3j...4k5l",
    type: "Contract",
    authorizedAt: "2024-03-12",
    permissions: ["deposit", "withdraw"],
    status: "active",
  },
  {
    id: "4",
    name: "ArrowRightvernance Voting",
    address: "0x9m0n...1p2q",
    type: "Contract",
    authorizedAt: "2024-01-25",
    permissions: ["vote"],
    status: "expired",
  },
]

function PermissionBadge({ permission }: { permission: string }) {
  return (
    <Badge variant="secondary" className="text-xs">
      {permission}
    </Badge>
  )
}

export default function ConnectedAppsPage() {
  const [oauthData, setOauthData] = useState(oauthConnections)
  const [contractsData, setContractsData] = useState(authorizedContracts)

  const handleRevokeOAuth = (id: string) => {
    setOauthData(oauthData.filter((c) => c.id !== id))
  }

  const handleRevokeContract = (id: string) => {
    setContractsData(contractsData.filter((c) => c.id !== id))
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Connected Apps</h1>
        <p className="mt-1 text-muted-foreground">
          Manage OAuth connections and authorized contracts
        </p>
      </div>

      {/* Info Banner */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Connected apps use these permissions</p>
              <p className="text-sm text-muted-foreground mt-1">
                OAuth connections and authorized contracts can access your account within the permissions granted.
                Review and revoke access regularly to maintain security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OAuth Connections */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            OAuth Connections
          </CardTitle>
          <CardDescription>
            Third-party applications connected via OAuth
          </CardDescription>
        </CardHeader>
        <CardContent>
          {oauthData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Connected</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {oauthData.map((connection) => (
                  <TableRow key={connection.id}>
                    <TableCell className="font-medium">{connection.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {connection.connectedAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {connection.permissions.map((perm) => (
                          <PermissionBadge key={perm} permission={perm} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {connection.status === "active" ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeOAuth(connection.id)}
                      >
                        <Unlink className="h-3.5 w-3.5 mr-1" />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No OAuth connections</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authorized Contracts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Authorized Contracts
          </CardTitle>
          <CardDescription>
            Smart contracts authorized to interact with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contractsData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Authorized</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractsData.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {contract.address}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contract.authorizedAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contract.permissions.map((perm) => (
                          <PermissionBadge key={perm} permission={perm} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.status === "active" ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeContract(contract.id)}
                      >
                        <Unlink className="h-3.5 w-3.5 mr-1" />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No authorized contracts</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Explanation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Permission Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Wallet Permissions</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">read:wallet</code> - View wallet address and balance</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">write:wallet</code> - Execute transactions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Asset Permissions</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">read:assets</code> - View asset holdings</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">write:assets</code> - Transfer assets</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Trading Permissions</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">swap</code> - Execute token swaps</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">approve</code> - Approve token spending</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Contract Permissions</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">stake/unstake</code> - Manage staking positions</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">vote</code> - Participate in governance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}