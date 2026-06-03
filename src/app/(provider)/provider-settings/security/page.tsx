"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MOCK_LOGIN_HISTORY } from "@/lib/mock-data"

export default function SecurityPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Security</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Chrome on Windows</TableCell>
                <TableCell>192.168.1.100</TableCell>
                <TableCell className="text-muted-foreground">Just now</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Revoke</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Safari on macOS</TableCell>
                <TableCell>10.0.0.50</TableCell>
                <TableCell className="text-muted-foreground">2 days ago</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Revoke</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_LOGIN_HISTORY.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{entry.device}</TableCell>
                  <TableCell>{entry.ip}</TableCell>
                  <TableCell>
                    <Badge variant={entry.status === 'success' ? 'default' : 'destructive'}>
                      {entry.status}
                    </Badge>
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