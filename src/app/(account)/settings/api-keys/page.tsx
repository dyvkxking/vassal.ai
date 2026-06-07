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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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

interface ApiKey {
  id: string
  name: string
  maskedKey: string
  created: string
  lastUsed: string
  permissions: {
    read: boolean
    write: boolean
    admin: boolean
  }
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    maskedKey: "vkn_••••••••••••••••abc123",
    created: "2026-03-15",
    lastUsed: "2 hours ago",
    permissions: { read: true, write: true, admin: false },
  },
  {
    id: "2",
    name: "Development Key",
    maskedKey: "vkn_••••••••••••••••def456",
    created: "2026-05-20",
    lastUsed: "3 days ago",
    permissions: { read: true, write: false, admin: false },
  },
  {
    id: "3",
    name: "Admin Key",
    maskedKey: "vkn_••••••••••••••••ghi789",
    created: "2026-04-10",
    lastUsed: "1 week ago",
    permissions: { read: true, write: true, admin: true },
  },
]

export default function ApiKeysSettingsPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [revokeKeyId, setRevokeKeyId] = useState<string | null>(null)

  // New key form state
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyPermissions, setNewKeyPermissions] = useState({
    read: true,
    write: false,
    admin: false,
  })
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleTogglePermission = (permission: keyof typeof newKeyPermissions) => {
    setNewKeyPermissions((prev) => ({ ...prev, [permission]: !prev[permission] }))
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return

    setIsCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate creating a new key
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      maskedKey: `vkn_••••••••••••••••${Math.random().toString(36).slice(2, 8)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      permissions: { ...newKeyPermissions },
    }

    setCreatedKey(`vkn_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`)
    setApiKeys([newKey, ...apiKeys])
    setIsCreating(false)
    setIsCreateDialogOpen(false)
    setNewKeyName("")
    setNewKeyPermissions({ read: true, write: false, admin: false })
  }

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== keyId))
    setRevokeKeyId(null)
  }

  const handleCloseCreatedKey = () => {
    setCreatedKey(null)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">API Keys</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your API keys for programmatic access
        </p>
      </div>

      <div className="space-y-6">
        {/* Create New Key */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Create and manage API keys for accessing the vassal.ai API
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Key</Button>
              </DialogTrigger>
              <DialogContent size="sm">
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key for programmatic access
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input
                      id="key-name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production API Key"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Permissions</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Read</Label>
                          <p className="text-xs text-muted-foreground">
                            Read access to resources
                          </p>
                        </div>
                        <Switch
                          checked={newKeyPermissions.read}
                          onCheckedChange={() => handleTogglePermission("read")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Write</Label>
                          <p className="text-xs text-muted-foreground">
                            Create and update resources
                          </p>
                        </div>
                        <Switch
                          checked={newKeyPermissions.write}
                          onCheckedChange={() => handleTogglePermission("write")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Admin</Label>
                          <p className="text-xs text-muted-foreground">
                            Full administrative access
                          </p>
                        </div>
                        <Switch
                          checked={newKeyPermissions.admin}
                          onCheckedChange={() => handleTogglePermission("admin")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim() || isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Key"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* Created Key Display */}
        {createdKey && (
          <Card className="border-green-500/50">
            <CardHeader>
              <CardTitle className="text-green-600">API Key Created</CardTitle>
              <CardDescription>
                Copy this key now. You will not be able to see it again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                {createdKey}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCloseCreatedKey}>Done</Button>
            </CardFooter>
          </Card>
        )}

        {/* API Keys List */}
        <Card>
          <CardContent className="pt-6">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API keys created yet
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between py-4 border-b last:border-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{key.name}</p>
                        <div className="flex gap-1">
                          {key.permissions.admin && (
                            <Badge variant="destructive">Admin</Badge>
                          )}
                          {key.permissions.read && (
                            <Badge variant="secondary">Read</Badge>
                          )}
                          {key.permissions.write && (
                            <Badge variant="secondary">Write</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-mono text-muted-foreground">
                        {key.maskedKey}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created {key.created} · Last used {key.lastUsed}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to revoke "{key.name}"? This action cannot be undone and any applications using this key will lose access.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevokeKey(key.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Revoke Key
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}