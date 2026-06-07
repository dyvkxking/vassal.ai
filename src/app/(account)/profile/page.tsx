"use client"

import { useState } from "react"
import { MOCK_USER_PROFILE } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check, Globe, GitBranch, Upload, Calendar, Activity, X } from 'lucide-react'

// Format timestamp to relative time
function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`
    }
  }
  return "just now"
}

// Format date for join date display
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Format number with commas
function formatNumber(num: number): string {
  return num.toLocaleString()
}

// Copy to clipboard helper
function CopyableAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

// Role badge mapping
const roleLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  creator: { label: "Creator", variant: "default" },
  provider: { label: "Provider", variant: "secondary" },
  client: { label: "Client", variant: "outline" },
  genesis: { label: "Genesis", variant: "default" },
}

export default function ProfilePage() {
  const profile = MOCK_USER_PROFILE
  const [editOpen, setEditOpen] = useState(false)
  const [formData, setFormData] = useState({
    displayName: profile.displayName || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
  })

  const handleSave = () => {
    // In a real app, this would submit to an API
    console.log("Saving profile:", formData)
    setEditOpen(false)
  }

  // Mock activity data
  const activities = [
    { id: 1, action: "Created agent 'DeFi Pulse Scanner'", timestamp: Date.now() - 2 * 86400000 },
    { id: 2, action: "Voted on Proposal #7", timestamp: Date.now() - 3 * 86400000 },
    { id: 3, action: "Earned $24.50 in rewards", timestamp: Date.now() - 5 * 86400000 },
    { id: 4, action: "Completed 50 sessions as Provider", timestamp: Date.now() - 7 * 86400000 },
    { id: 5, action: "Published skill 'Web3 Read'", timestamp: Date.now() - 30 * 86400000 },
  ]

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-border">
                  <AvatarImage src={profile.avatarUrl} alt={profile.displayName || "User"} />
                  <AvatarFallback className="text-4xl">
                    {profile.displayName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Upload className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {profile.displayName || "Anonymous"}
                  </h1>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <CopyableAddress address={profile.address} />
                  </div>
                </div>
                <Sheet open={editOpen} onOpenChange={setEditOpen}>
                  <SheetTrigger>
                    <Button variant="outline">Edit Profile</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit Profile</SheetTitle>
                      <SheetDescription>
                        Update your profile information.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          placeholder="Your display name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                        <Input
                          id="avatarUrl"
                          value={formData.avatarUrl}
                          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    </div>
                    <SheetFooter>
                      <Button variant="outline" onClick={() => setEditOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Role Badges */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {profile.roles.map((role) => {
                  const roleConfig = roleLabels[role] || { label: role, variant: "outline" as const }
                  return (
                    <Badge key={role} variant={roleConfig.variant}>
                      {roleConfig.label}
                    </Badge>
                  )
                })}
                {profile.isGenesisParticipant && (
                  <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
                    Genesis
                  </Badge>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-muted-foreground mb-4">{profile.bio}</p>
              )}

              {/* Join Date */}
              <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(profile.joinedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions as Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(profile.stats.totalSessionsAsProvider)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions as Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(profile.stats.totalSessionsAsClient)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agents Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(profile.stats.agentsCreated)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skills Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(profile.stats.skillsPublished)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Proposals Voted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(profile.stats.proposalsVoted)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts & Social Links */}
        <div className="space-y-6">
          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DA1F2]/10">
                    <X className="h-5 w-5 text-[#1DA1F2]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Home</p>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#333]/10">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Globe</p>
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  website.com
                </a>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <X className="h-5 w-5 text-muted-foreground" />
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @username
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}