"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// ---- Mock Data ----
const MOCK_USER = {
  id: 'user-001',
  address: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
  email: 'user@example.com',
  username: 'crypto_trader_42',
  role: 'agent_owner',
  createdAt: Date.now() - 86400000 * 180,
  lastActiveAt: Date.now() - 3600000 * 2,
  status: 'active',
  flags: [],
  permissions: ['create_agent', 'submit_skill', 'vote_proposal', 'delegate'],
  agentCount: 3,
  totalVolumeMesh: 15420,
  qualityScore: 87,
}

const SESSION_HISTORY = [
  {
    id: 'sess-001',
    timestamp: Date.now() - 3600000 * 2,
    action: 'Login',
    ip: '192.168.1.xxx',
    device: 'Chrome on Monitor',
    success: true,
  },
  {
    id: 'sess-002',
    timestamp: Date.now() - 86400000 * 1,
    action: 'Submit Agent',
    ip: '192.168.1.xxx',
    device: 'Chrome on Monitor',
    success: true,
  },
  {
    id: 'sess-003',
    timestamp: Date.now() - 86400000 * 3,
    action: 'Login',
    ip: '10.0.0.xxx',
    device: 'Safari on iOS',
    success: true,
  },
  {
    id: 'sess-004',
    timestamp: Date.now() - 86400000 * 7,
    action: 'Vote on Proposal #45',
    ip: '10.0.0.xxx',
    device: 'Safari on iOS',
    success: true,
  },
  {
    id: 'sess-005',
    timestamp: Date.now() - 86400000 * 15,
    action: 'Failed Login Attempt',
    ip: '203.0.113.xxx',
    device: 'Unknown',
    success: false,
  },
]

const USER_ACTIVITY = [
  {
    id: 'act-001',
    type: 'agent_submission',
    description: 'Submitted "Yield Harvester Pro" for review',
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'act-002',
    type: 'skill_submission',
    description: 'Published "Cross-Chain Bridge" skill',
    timestamp: Date.now() - 86400000 * 10,
  },
  {
    id: 'act-003',
    type: 'governance_vote',
    description: 'Voted on Proposal #43',
    timestamp: Date.now() - 86400000 * 14,
  },
  {
    id: 'act-004',
    type: 'agent_update',
    description: 'Updated "Flash Loan Bot" version to 2.1.0',
    timestamp: Date.now() - 86400000 * 30,
  },
]

const SEARCH_RESULTS = [
  {
    id: 'user-001',
    address: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    email: 'user@example.com',
    username: 'crypto_trader_42',
    role: 'agent_owner',
    status: 'active',
  },
  {
    id: 'user-002',
    address: '0xffff9999eeee8888dddd7777cccc6666bbbb5555',
    email: 'another@example.com',
    username: 'defi_ Whale',
    role: 'validator',
    status: 'active',
  },
  {
    id: 'user-003',
    address: '0x1111aaaa2222bbbb3333cccc4444dddd5555eeee',
    email: 'suspicious@spam.com',
    username: 'unknown_user',
    role: 'user',
    status: 'suspended',
  },
]

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days}d ago`
  const hours = Math.floor(diff / 3600000)
  if (hours > 0) return `${hours}h ago`
  return 'Just now'
}

function statusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-600">Active</Badge>
    case 'suspended':
      return <Badge variant="destructive">Suspended</Badge>
    case 'banned':
      return <Badge variant="destructive">Banned</Badge>
    case 'pending':
      return <Badge variant="outline">Pending</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function roleBadge(role: string) {
  return <Badge variant="secondary">{role.replace('_', ' ')}</Badge>
}

// ---- Search Results Table ----
function SearchResultsTable({ users, onSelect }: { users: typeof SEARCH_RESULTS, onSelect: (id: string) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-mono text-xs">{user.address}</TableCell>
            <TableCell className="text-sm">{user.email}</TableCell>
            <TableCell className="text-sm">{user.username}</TableCell>
            <TableCell>{roleBadge(user.role)}</TableCell>
            <TableCell>{statusBadge(user.status)}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onSelect(user.id)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// ---- User Detail View ----
function UserDetailView({ user, onBack }: { user: typeof MOCK_USER, onBack: () => void }) {
  const [openSuspendDialog, setOpenSuspendDialog] = useState(false)
  const [openBanDialog, setOpenBanDialog] = useState(false)
  const [openReinstateDialog, setOpenReinstateDialog] = useState(false)
  const [actionReason, setActionReason] = useState('')

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack}>Back to Search</Button>

      {/* User Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            {statusBadge(user.status)}
            {roleBadge(user.role)}
          </div>
          <p className="font-mono text-sm text-muted-foreground">{user.address}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Joined {formatDate(user.createdAt)}</span>
            <span>Last active {formatRelative(user.lastActiveAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {user.status === 'active' && (
            <>
              <Button variant="outline" onClick={() => setOpenSuspendDialog(true)}>
                Suspend
              </Button>
              <Button variant="destructive" onClick={() => setOpenBanDialog(true)}>
                Ban
              </Button>
            </>
          )}
          {(user.status === 'suspended' || user.status === 'banned') && (
            <Button variant="default" onClick={() => setOpenReinstateDialog(true)}>
              Reinstate
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.agentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volume (MESH)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.totalVolumeMesh.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.qualityScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.flags.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((perm) => (
              <Badge key={perm} variant="outline">{perm.replace('_', ' ')}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity & Sessions */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="sessions">Session History</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {USER_ACTIVITY.map((act) => (
                    <TableRow key={act.id}>
                      <TableCell>
                        <Badge variant="outline">{act.type.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{act.description}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatRelative(act.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SESSION_HISTORY.map((sess) => (
                    <TableRow key={sess.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(sess.timestamp)}
                      </TableCell>
                      <TableCell className="text-sm">{sess.action}</TableCell>
                      <TableCell className="font-mono text-xs">{sess.ip}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sess.device}</TableCell>
                      <TableCell>
                        {sess.success ? (
                          <Badge className="bg-green-600">Success</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Suspend Dialog */}
      <Dialog open={openSuspendDialog} onOpenChange={setOpenSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Suspend "{user.username}"? They will not be able to submit new agents or skills until reinstated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Reason (optional)</Label>
            <Input
              placeholder="Enter suspension reason..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenSuspendDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setOpenSuspendDialog(false)
                setActionReason('')
              }}
            >
              Confirm Suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={openBanDialog} onOpenChange={setOpenBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Permanently ban "{user.username}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTitle>Permanent Action</AlertTitle>
            <AlertDescription>
              Banning is irreversible. The user will lose all access permanently.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Label>Reason (required)</Label>
            <Input
              placeholder="Enter ban reason..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenBanDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!actionReason.trim()}
              onClick={() => {
                setOpenBanDialog(false)
                setActionReason('')
              }}
            >
              Confirm Ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reinstate Dialog */}
      <Dialog open={openReinstateDialog} onOpenChange={setOpenReinstateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reinstate User</DialogTitle>
            <DialogDescription>
              Restore access for "{user.username}"? They will regain all previous permissions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenReinstateDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => setOpenReinstateDialog(false)}
            >
              Reinstate User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---- Main Page ----
export default function UserSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchPerformed(true)
  }

  const handleSelectUser = (id: string) => {
    setSelectedUserId(id)
  }

  const handleBack = () => {
    setSelectedUserId(null)
  }

  if (selectedUserId) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <UserDetailView user={MOCK_USER} onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search for users by address, email, or username to view details and manage accounts.
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by address, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
            <span>Examples:</span>
            <span className="font-mono">0xaaaa...1111</span>
            <span>user@example.com</span>
            <span>crypto_trader</span>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchPerformed && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Results</CardTitle>
            <CardDescription>
              {SEARCH_RESULTS.length} result{SEARCH_RESULTS.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchResultsTable users={SEARCH_RESULTS} onSelect={handleSelectUser} />
          </CardContent>
        </Card>
      )}

      {!searchPerformed && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Enter a search query to find users</p>
        </div>
      )}
    </div>
  )
}