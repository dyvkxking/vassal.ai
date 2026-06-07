'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
  Input,
  Separator,
} from '@/components/ui'
import { ArrowLeft, Plus, AlertTriangle } from 'lucide-react'
import { getSkillById, MOCK_USER_PROFILE } from '@/lib/mock-data'

interface Version {
  version: string
  date: string
  status: 'active' | 'deprecated'
  invocations: number
  breaking: boolean
  changelog?: string
}

const generateVersionList = (skillId: string, currentVersion: string): Version[] => [
  {
    version: currentVersion,
    date: new Date().toISOString(),
    status: 'active',
    invocations: 12500,
    breaking: false,
  },
  {
    version: `${parseFloat(currentVersion.split('.')[0]) - 1}.${currentVersion.split('.')[1]}.0`,
    date: new Date(Date.now() - 90 * 86400000).toISOString(),
    status: 'deprecated',
    invocations: 8750,
    breaking: false,
    changelog: 'Added support for trace data in EVM chains',
  },
  {
    version: `${parseFloat(currentVersion.split('.')[0]) - 2}.0.0`,
    date: new Date(Date.now() - 180 * 86400000).toISOString(),
    status: 'deprecated',
    invocations: 3200,
    breaking: true,
    changelog: 'Initial public release with core EVM data retrieval functionality',
  },
]

export default function SkillVersionPage() {
  const params = useParams()
  const skillId = params.id as string
  const skill = getSkillById(skillId)
  const [versions, setVersions] = useState<Version[]>(
    skill ? generateVersionList(skillId, skill.version) : []
  )
  const [deprecateDialogVersion, setDeprecateDialogVersion] = useState<string | null>(null)
  const [newVersionDialogOpen, setNewVersionDialogOpen] = useState(false)
  const [migrationGuide, setMigrationGuide] = useState('')
  const [newChangelog, setNewChangelog] = useState('')

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Skill Not Found</CardTitle>
            <CardDescription>
              The skill you are looking for does not exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/my-skills">Back to My Skills</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = skill.author === MOCK_USER_PROFILE.address

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to manage versions for this skill.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/my-skills">Back to My Skills</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDeprecate = (version: string) => {
    setVersions(prev =>
      prev.map(v =>
        v.version === version ? { ...v, status: 'deprecated' as const } : v
      )
    )
    setDeprecateDialogVersion(null)
  }

  const handleCreateVersion = () => {
    const [major, minor] = skill.version.split('.').map(Number)
    const newVersion = `${major + 1}.0.0`
    const newVersionEntry: Version = {
      version: newVersion,
      date: new Date().toISOString(),
      status: 'active',
      invocations: 0,
      breaking: false,
      changelog: newChangelog,
    }

    // Deprecate current version
    setVersions(prev => [
      newVersionEntry,
      ...prev.map(v =>
        v.version === skill.version ? { ...v, status: 'deprecated' as const } : v
      ),
    ])

    setNewVersionDialogOpen(false)
    setNewChangelog('')
  }

  const activeVersion = versions.find(v => v.status === 'active')
  const deprecatedVersions = versions.filter(v => v.status === 'deprecated')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/my-skills">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{skill.name} — Version Management</h1>
              <p className="text-sm text-muted-foreground">Manage skill versions and releases</p>
            </div>
            <Button onClick={() => setNewVersionDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              New Version
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Active Version */}
        {activeVersion && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Active Version</CardTitle>
                  <Badge>v{activeVersion.version}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Released {new Date(activeVersion.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Invocations: </span>
                    <span className="font-medium">{activeVersion.invocations.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <CardDescription>
                Current version in production
              </CardDescription>
            </CardHeader>
            {activeVersion.changelog && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{activeVersion.changelog}</p>
              </CardContent>
            )}
          </Card>
        )}

        {/* Deprecated Versions */}
        {deprecatedVersions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Deprecated Versions</CardTitle>
              <CardDescription>Previous versions no longer in active use</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Invocations</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deprecatedVersions.map((version) => (
                    <TableRow key={version.version}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">v{version.version}</span>
                          {version.breaking && (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                              Breaking
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(version.date).toLocaleDateString()}</TableCell>
                      <TableCell>{version.invocations.toLocaleString()}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {version.changelog || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Deprecated</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => setDeprecateDialogVersion(version.version)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Migration Guide Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Guide</CardTitle>
            <CardDescription>
              Document breaking changes and upgrade instructions for skill users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-40"
              placeholder="Describe how users should migrate from deprecated versions. Include breaking changes, required updates, and timeline."
              value={migrationGuide}
              onChange={(e) => setMigrationGuide(e.target.value)}
            />
            <div className="flex justify-end">
              <Button variant="outline">Save Migration Guide</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deprecate Confirmation Dialog */}
      <Dialog open={!!deprecateDialogVersion} onOpenChange={() => setDeprecateDialogVersion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-500" />
              Version Deprecation
            </DialogTitle>
            <DialogDescription>
              Deprecating a version will mark it as inactive. Users will be notified to upgrade.
              This action cannot be easily reversed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              You are about to deprecate version <span className="font-mono font-medium">{deprecateDialogVersion}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeprecateDialogVersion(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deprecateDialogVersion && handleDeprecate(deprecateDialogVersion)}
            >
              Confirm Deprecation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Version Dialog */}
      <Dialog open={newVersionDialogOpen} onOpenChange={setNewVersionDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              Release a new version of your skill. The current active version will be deprecated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Changelog</label>
              <Textarea
                className="mt-2"
                placeholder="Describe what is new in this version..."
                value={newChangelog}
                onChange={(e) => setNewChangelog(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="breaking"
                className="rounded border-muted"
              />
              <label htmlFor="breaking" className="text-sm">
                This version contains breaking changes
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewVersionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVersion} disabled={!newChangelog.trim()}>
              Create Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}