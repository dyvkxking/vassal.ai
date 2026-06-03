"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ActivityEntry {
  id: string
  type: string
  description: string
  timestamp: string
}

const activityTimeline: ActivityEntry[] = [
  { id: "1", type: "session", description: "Completed session with Alpha Miner", timestamp: "2026-06-04T10:30:00Z" },
  { id: "2", type: "earning", description: "Earned 45.50 MESH from provider fees", timestamp: "2026-06-04T09:15:00Z" },
  { id: "3", type: "agent", description: "Created new agent: Data Aggregator", timestamp: "2026-06-03T16:45:00Z" },
  { id: "4", type: "review", description: "Left review for DeFi Strategist", timestamp: "2026-06-02T14:20:00Z" },
  { id: "5", type: "session", description: "Launched session with Analytics Pro", timestamp: "2026-06-01T11:00:00Z" },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState("Alex Chen")
  const [bio, setBio] = useState("Web3 developer and agent builder. Passionate about decentralized systems.")
  const [twitterUrl, setTwitterUrl] = useState("https://twitter.com/alexchen")
  const [githubUrl, setGithubUrl] = useState("https://github.com/alexchen")
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex")

  const handleSave = () => {
    // Save profile changes
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setDisplayName("Alex Chen")
    setBio("Web3 developer and agent builder. Passionate about decentralized systems.")
    setTwitterUrl("https://twitter.com/alexchen")
    setGithubUrl("https://github.com/alexchen")
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>Manage your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-muted overflow-hidden">
                <img
                  src={avatarUrl}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <Button variant="outline" size="sm">Change</Button>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium">Display Name</label>
                {isEditing ? (
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                ) : (
                  <p className="text-lg">{displayName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{bio}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="twitter" className="text-sm font-medium">Twitter URL</label>
                {isEditing ? (
                  <Input
                    id="twitter"
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                ) : (
                  <a href={twitterUrl} className="text-primary hover:underline">{twitterUrl}</a>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="github" className="text-sm font-medium">GitHub URL</label>
                {isEditing ? (
                  <Input
                    id="github"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                ) : (
                  <a href={githubUrl} className="text-primary hover:underline">{githubUrl}</a>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Role Badges</CardTitle>
          <CardDescription>Your verified roles in the ecosystem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Badge variant="default" className="text-sm px-4 py-2">Creator</Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">Provider</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Genesis Participant</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Your recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityTimeline.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="font-medium">{entry.description}</p>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">{entry.type}</Badge>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}