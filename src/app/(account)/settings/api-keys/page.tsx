"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOCK_API_KEYS } from "@/lib/mock-data"

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(MOCK_API_KEYS)

  const handleRevokeKey = (keyId: string) => {
    if (confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      setKeys(keys.filter((k) => k.id !== keyId))
    }
  }

  const handleCreateKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: `New Key ${keys.length + 1}`,
      permissions: ["read"] as string[],
      created: new Date().toISOString(),
      lastUsed: "Never",
      rateLimit: 1000,
    }
    setKeys([newKey, ...keys])
    alert("New API key created!")
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Keys</h1>
        <Button onClick={handleCreateKey}>Create New Key</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage API keys for authentication. Keep your keys secure and never share them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {key.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(key.created).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(key.lastUsed).toLocaleString()}</TableCell>
                  <TableCell>{key.rateLimit.toLocaleString()}/min</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeKey(key.id)}
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
    </div>
  )
}