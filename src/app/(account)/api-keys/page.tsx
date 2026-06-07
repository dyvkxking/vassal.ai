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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Key, Plus, Copy, Check, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

// Mock API keys data
const apiKeys = [
  {
    id: "1",
    name: "Production Key",
    key: "vsl_live_xxxxxxxxxxxxxxxxxxxx",
    maskedKey: "vsl_live_••••••••••••••••xxxx",
    permissions: ["read", "write"],
    createdAt: "2024-01-15",
    lastUsed: "2024-03-15 14:32",
    active: true,
  },
  {
    id: "2",
    name: "Development Key",
    key: "vsl_test_xxxxxxxxxxxxxxxxxxxx",
    maskedKey: "vsl_test_••••••••••••••••xxxx",
    permissions: ["read", "write"],
    createdAt: "2024-02-20",
    lastUsed: "2024-03-14 09:15",
    active: true,
  },
  {
    id: "3",
    name: "Admin Key",
    key: "vsl_admin_xxxxxxxxxxxxxxxxxxx",
    maskedKey: "vsl_admin_••••••••••••••••xxx",
    permissions: ["read", "write", "admin"],
    createdAt: "2024-01-10",
    lastUsed: "2024-03-10 11:22",
    active: true,
  },
]

function PermissionBadge({ permission }: { permission: string }) {
  const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    read: "secondary",
    write: "default",
    admin: "destructive",
  }
  return (
    <Badge variant={variants[permission] || "outline"} className="capitalize">
      {permission}
    </Badge>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function APIKeysPage() {
  const [keys, setKeys] = useState(apiKeys)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyPermissions, setNewKeyPermissions] = useState({
    read: true,
    write: false,
    admin: false,
  })
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRevoke = (keyId: string) => {
    setKeys(keys.filter((k) => k.id !== keyId))
  }

  const handleCreateKey = () => {
    // Simulate creating a new key
    const newKey = {
      id: (keys.length + 1).toString(),
      name: newKeyName,
      key: `vsl_${newKeyName.toLowerCase().replace(/\s+/g, "_")}_xxxxxxxxxxxxxxxxxxxx`,
      maskedKey: `vsl_${newKeyName.toLowerCase().replace(/\s+/g, "_")}_••••••••••••••••xxxx`,
      permissions: Object.entries(newKeyPermissions)
        .filter(([, enabled]) => enabled)
        .map(([perm]) => perm),
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      active: true,
    }
    setKeys([...keys, newKey])
    setCreatedKey(newKey.key)
    setNewKeyName("")
    setNewKeyPermissions({ read: true, write: false, admin: false })
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setCreatedKey(null)
    setNewKeyName("")
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-medium">API Keys</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key for programmatic access to your account
              </DialogDescription>
            </DialogHeader>
            {createdKey ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-500/10 p-4">
                  <p className="text-sm font-medium text-green-600 mb-2">
                    API Key Created Successfully
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Copy this key now. You will not be able to see it again.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted p-2 text-sm font-mono break-all">
                      {createdKey}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(createdKey, "new")}
                    >
                      {copiedId === "new" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={closeCreateDialog}>Done</Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Production Key"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={newKeyPermissions.read}
                          onCheckedChange={(checked) =>
                            setNewKeyPermissions({ ...newKeyPermissions, read: checked })
                          }
                        />
                        <span className="text-sm">Read</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        View data and resources
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={newKeyPermissions.write}
                          onCheckedChange={(checked) =>
                            setNewKeyPermissions({ ...newKeyPermissions, write: checked })
                          }
                        />
                        <span className="text-sm">Write</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Create and modify data
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={newKeyPermissions.admin}
                          onCheckedChange={(checked) =>
                            setNewKeyPermissions({ ...newKeyPermissions, admin: checked })
                          }
                        />
                        <span className="text-sm">Admin</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Full administrative access
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!createdKey && (
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
                  Create Key
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Rate Limit Info */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Rate Limit</p>
                <p className="text-xs text-muted-foreground">
                  Your API usage is within limits
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">1,247 / 10,000 requests</p>
              <p className="text-xs text-muted-foreground">Reset hourly</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Keys used for programmatic access to the Vassal API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-muted-foreground">
                        {key.maskedKey}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(key.key, key.id)}
                      >
                        {copiedId === key.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {key.permissions.map((perm) => (
                        <PermissionBadge key={perm} permission={perm} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(key.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {key.lastUsed}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevoke(key.id)}
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

      {/* How to Use Guide */}
      <Card className="mt-6">
        <CardHeader>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-between h-auto p-0"
            onClick={() => setShowGuide(!showGuide)}
          >
            <div className="text-left">
              <CardTitle className="text-base">How to Use API Keys</CardTitle>
              <CardDescription>
                Documentation for using your API keys
              </CardDescription>
            </div>
            {showGuide ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </CardHeader>
        {showGuide && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Include your API key in the request header:
              </p>
              <code className="block rounded bg-muted p-3 text-sm font-mono">
                Authorization: Bearer your_api_key_here
              </code>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Example Request</h4>
              <code className="block rounded bg-muted p-3 text-sm font-mono">
                curl -X GET https://api.vassal.ai/v1/agents \<br />
                -H "Authorization: Bearer vsl_live_xxxxxxxxxxxxxxxxxxxx" \<br />
                -H "Content-Type: application/json"
              </code>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Best Practices</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Never share your API keys or commit them to version control</li>
                <li>Use environment variables to store your keys securely</li>
                <li>Rotate keys periodically for enhanced security</li>
                <li>Use minimal permissions for your use case</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}