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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Shield, Monitor, MapPin, Clock, Smartphone, Laptop, Tablet, LogOut } from 'lucide-react'

// Mock data for connected wallets
const wallets = [
  { address: "0x7a9f...3e4d", type: "MetaMask", connectedAt: "2024-01-15" },
  { address: "0xb3c2...7f8a", type: "WalletConnect", connectedAt: "2024-02-20" },
]

// Mock data for active sessions
const sessions = [
  {
    id: "1",
    device: "Chrome on MacOS",
    deviceType: "laptop",
    location: "San Francisco, CA",
    lastActive: Date.now() - 5 * 60 * 1000,
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    deviceType: "smartphone",
    location: "San Francisco, CA",
    lastActive: Date.now() - 2 * 60 * 60 * 1000,
    current: false,
  },
  {
    id: "3",
    device: "Firefox on Monitor",
    deviceType: "desktop",
    location: "New York, NY",
    lastActive: Date.now() - 24 * 60 * 60 * 1000,
    current: false,
  },
]

// Mock data for login history
const loginHistory = [
  { id: "1", date: "2024-03-15 14:32", device: "Chrome on MacOS", ip: "192.168.1.1", status: "Success" },
  { id: "2", date: "2024-03-14 09:15", device: "Safari on iPhone", ip: "10.0.0.5", status: "Success" },
  { id: "3", date: "2024-03-12 18:45", device: "Firefox on Monitor", ip: "172.16.0.3", status: "Failed" },
  { id: "4", date: "2024-03-10 11:22", device: "Chrome on MacOS", ip: "192.168.1.1", status: "Success" },
]

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  if (hours >= 1) return `${hours}h ago`
  if (minutes >= 1) return `${minutes}m ago`
  return "just now"
}

function DeviceIcon({ type }: { type: string }) {
  switch (type) {
    case "smartphone":
      return <Smartphone className="h-4 w-4" />
    case "tablet":
      return <Tablet className="h-4 w-4" />
    default:
      return <Laptop className="h-4 w-4" />
  }
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === "Success" ? "default" : "destructive"
  return <Badge variant={variant as "default" | "destructive"}>{status}</Badge>
}

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionsData, setSessionsData] = useState(sessions)

  const handleRevokeSession = (sessionId: string) => {
    setSessionsData(sessionsData.filter((s) => s.id !== sessionId))
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Security</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account security, connected wallets, and active sessions
        </p>
      </div>

      <div className="space-y-6">
        {/* Connected Wallets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Connected Wallets
            </CardTitle>
            <CardDescription>
              Wallets connected to your account for authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Connected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallets.map((wallet) => (
                  <TableRow key={wallet.address}>
                    <TableCell className="font-mono text-sm">{wallet.address}</TableCell>
                    <TableCell>{wallet.type}</TableCell>
                    <TableCell className="text-muted-foreground">{wallet.connectedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Devices currently logged into your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionsData.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DeviceIcon type={session.deviceType} />
                        <span>{session.device}</span>
                        {session.current && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {session.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {timeAgo(session.lastActive)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!session.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          <LogOut className="h-3.5 w-3.5 mr-1" />
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">
                  Use an authenticator app like Search Authenticator or Authy
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            <Separator />
            {twoFactorEnabled && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium mb-2">Recovery Codes</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Save these recovery codes in a secure location. You can use them to access your account if you lose access to your authenticator.
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  <span>A1B2-C3D4-E5F6</span>
                  <span>G7H8-I9J0-K1L2</span>
                  <span>M3N4-O5P6-Q7R8</span>
                  <span>S9T0-U1V2-W3X4</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Login History
            </CardTitle>
            <CardDescription>
              Recent login attempts and activity on your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((login) => (
                  <TableRow key={login.id}>
                    <TableCell className="text-muted-foreground">{login.date}</TableCell>
                    <TableCell>{login.device}</TableCell>
                    <TableCell className="font-mono text-sm">{login.ip}</TableCell>
                    <TableCell><StatusBadge status={login.status} /></TableCell>
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