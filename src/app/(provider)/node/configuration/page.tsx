"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_PROVIDER_NODES } from "@/lib/mock-data"

export default function NodeConfigurationPage() {
  const node = MOCK_PROVIDER_NODES[0]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Node Configuration</h1>
        <Badge variant={node.status === 'online' ? 'default' : 'destructive'}>
          {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Primary Node US-East</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Max Concurrent Sessions</p>
                <p className="text-sm text-muted-foreground">Maximum number of simultaneous sessions</p>
              </div>
              <div className="w-48">
                <Slider defaultValue={[node.maxConcurrentSessions]} min={1} max={100} step={1} />
                <p className="text-center text-sm mt-2">{node.maxConcurrentSessions}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Min TPM Floor</p>
                <p className="text-sm text-muted-foreground">Minimum tokens per minute threshold</p>
              </div>
              <div className="w-48">
                <Slider defaultValue={[node.minTpmFloor / 100000]} min={100} max={5000} step={50} />
                <p className="text-center text-sm mt-2">{(node.minTpmFloor / 1000000).toFixed(1)}M</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Max Latency Threshold</p>
                <p className="text-sm text-muted-foreground">Maximum allowed latency in milliseconds</p>
              </div>
              <div className="w-48">
                <Slider defaultValue={[node.maxLatencyThreshold]} min={50} max={500} step={10} />
                <p className="text-center text-sm mt-2">{node.maxLatencyThreshold}ms</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Skill Whitelist</p>
                <p className="text-sm text-muted-foreground">Allowed skills for this node</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {node.skillWhitelist.map(skill => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Add skill..." className="max-w-xs" />
              <Button variant="outline">Add</Button>
            </div>
          </div>

          <div className="border-t pt-6 flex gap-2">
            <Button>Save Changes</Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}