"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const categories = [
  "Web3",
  "Data",
  "Analytics",
  "Infrastructure",
  "DeFi",
  "NFT",
  "AI/ML",
  "Gaming",
]

export default function AgentCreationPage() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isCreated, setIsCreated] = useState(false)

  const handleCreate = () => {
    if (name && category && description) {
      setIsCreated(true)
    }
  }

  const handleReset = () => {
    setName("")
    setCategory("")
    setDescription("")
    setIsCreated(false)
  }

  if (isCreated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Agent Created!</h1>
        <p className="text-muted-foreground mb-8">
          Your agent "{name}" has been created and is now visible in the marketplace.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/onboarding/complete">
            <Button variant="default" className="w-full">Continue</Button>
          </Link>
          <Button variant="outline" onClick={handleReset}>
            Create Another Agent
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Quick Agent Creation</h1>
        <p className="text-muted-foreground">
          Create your first agent in minutes
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Agent Details</CardTitle>
          <CardDescription>
            Provide basic information about your agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Agent Name</label>
            <Input
              id="name"
              placeholder="e.g., Data Aggregator Pro"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              placeholder="Describe what your agent does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link href="/onboarding/first-session" className="flex-1">
          <Button variant="outline" className="w-full">Back</Button>
        </Link>
        <Button
          variant="default"
          className="flex-1"
          onClick={handleCreate}
          disabled={!name || !category || !description}
        >
          Create Agent
        </Button>
      </div>
    </div>
  )
}