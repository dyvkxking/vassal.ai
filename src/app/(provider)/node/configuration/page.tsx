'use client'

import { useState } from 'react'
import { MOCK_PROVIDER_NODES, MOCK_SKILLS } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
} from '@/components/ui/alert-dialog'
import { Save, RotateCcw } from 'lucide-react'

interface ConfigChange {
  id: string
  field: string
  oldValue: string
  newValue: string
  timestamp: number
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export default function NodeConfigurationPage() {
  const node = MOCK_PROVIDER_NODES[0]
  const [configValues, setConfigValues] = useState({
    maxConcurrentSessions: '5',
    minTpmFloor: '50000',
    maxLatencyThreshold: '1500',
  })
  const [skillWhitelist, setSkillWhitelist] = useState<string[]>(['skill-web3-read', 'skill-price-feed'])
  const [autoRestartOnCrash, setAutoRestartOnCrash] = useState(true)
  const [configChanges, setConfigChanges] = useState<ConfigChange[]>([
    {
      id: 'change-1',
      field: 'maxConcurrentSessions',
      oldValue: '3',
      newValue: '5',
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'change-2',
      field: 'minTpmFloor',
      oldValue: '30000',
      newValue: '50000',
      timestamp: Date.now() - 43200000,
    },
    {
      id: 'change-3',
      field: 'autoRestartOnCrash',
      oldValue: 'false',
      newValue: 'true',
      timestamp: Date.now() - 21600000,
    },
  ])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleConfigChange = (field: string, value: string | boolean) => {
    if (typeof value === 'boolean') {
      setAutoRestartOnCrash(value)
    } else {
      setConfigValues(prev => ({ ...prev, [field]: value }))
    }
    setHasUnsavedChanges(true)
  }

  const handleSaveConfig = () => {
    const newChange: ConfigChange = {
      id: `change-${Date.now()}`,
      field: 'multiple',
      oldValue: 'various',
      newValue: 'various',
      timestamp: Date.now(),
    }
    setConfigChanges(prev => [newChange, ...prev])
    setHasUnsavedChanges(false)
  }

  const handleResetConfig = () => {
    setConfigValues({
      maxConcurrentSessions: '5',
      minTpmFloor: '50000',
      maxLatencyThreshold: '1500',
    })
    setSkillWhitelist(['skill-web3-read', 'skill-price-feed'])
    setAutoRestartOnCrash(true)
    setHasUnsavedChanges(false)
  }

  const handleToggleSkill = (skillId: string) => {
    setSkillWhitelist(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
    setHasUnsavedChanges(true)
  }

  const handleSaveSkillWhitelist = () => {
    const newChange: ConfigChange = {
      id: `change-${Date.now()}`,
      field: 'skillWhitelist',
      oldValue: 'skill-web3-read, skill-price-feed',
      newValue: skillWhitelist.join(', '),
      timestamp: Date.now(),
    }
    setConfigChanges(prev => [newChange, ...prev])
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Node Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Configure your provider node settings and manage skill permissions
        </p>
      </div>

      {/* Node Info Banner */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-3 rounded-full bg-green-500" />
              <div>
                <div className="font-medium">Node: {node.id}</div>
                <div className="text-sm text-muted-foreground">
                  Hardware: {node.hardware.cpuCores} cores, {node.hardware.gpuModel ?? 'N/A'} GPU
                </div>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-600">Online</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Max Concurrent Sessions */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="max-concurrent-sessions">
                Max Concurrent Sessions
              </label>
              <Input
                id="max-concurrent-sessions"
                type="number"
                value={configValues.maxConcurrentSessions}
                onChange={(e) => handleConfigChange('maxConcurrentSessions', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of simultaneous sessions
              </p>
            </div>

            {/* Min TPM Floor */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="min-tpm-floor">
                Min TPM Floor
              </label>
              <Input
                id="min-tpm-floor"
                type="number"
                value={configValues.minTpmFloor}
                onChange={(e) => handleConfigChange('minTpmFloor', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum tokens per minute floor
              </p>
            </div>

            {/* Max Latency Threshold */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="max-latency-threshold">
                Max Latency Threshold (ms)
              </label>
              <Input
                id="max-latency-threshold"
                type="number"
                value={configValues.maxLatencyThreshold}
                onChange={(e) => handleConfigChange('maxLatencyThreshold', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum acceptable latency in milliseconds
              </p>
            </div>
          </div>

          <Separator />

          {/* Auto-restart on Crash */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Auto-restart on Crash</label>
              <p className="text-sm text-muted-foreground">
                Automatically restart the node if it crashes or becomes unresponsive
              </p>
            </div>
            <Switch
              checked={autoRestartOnCrash}
              onCheckedChange={(checked) => handleConfigChange('autoRestartOnCrash', checked)}
            />
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResetConfig}>
                <RotateCcw className="size-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!hasUnsavedChanges}>
                  <Save className="size-4 mr-2" />
                  Save Configuration
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save Configuration</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will update your node configuration with the new settings. Changes will take effect immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSaveConfig}>
                    Save Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Skill Whitelist */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Skill Whitelist</CardTitle>
            <Button variant="outline" size="sm" onClick={handleSaveSkillWhitelist}>
              Save Skill Whitelist
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Select which skills your node is allowed to use. Only approved skills will be available for sessions.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_SKILLS.map((skill) => (
              <div
                key={skill.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  skillWhitelist.includes(skill.id)
                    ? 'bg-primary/5 border-primary/20'
                    : 'hover:bg-muted/30'
                }`}
              >
                <div className="space-y-0.5 flex-1 mr-4">
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-xs text-muted-foreground">{skill.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Category: {skill.category} | Rating: {skill.avgRating}
                  </div>
                </div>
                <Switch
                  checked={skillWhitelist.includes(skill.id)}
                  onCheckedChange={() => handleToggleSkill(skill.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Change History */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Change History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Previous Value</TableHead>
                <TableHead>New Value</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="font-medium capitalize">
                    {change.field.replace(/([A-Z])/g, ' $1').trim()}
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{change.oldValue}</code>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{change.newValue}</code>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatTimestamp(change.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {configChanges.length === 0 && (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              No configuration changes recorded
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}