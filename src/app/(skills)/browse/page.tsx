"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { MOCK_SKILLS } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Search, TrendingUp, Flame, Sparkles, ArrowUpDown } from 'lucide-react'

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "web3", label: "Web3" },
  { value: "data", label: "Data" },
  { value: "ai-ml", label: "AI/ML" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "defi", label: "DeFi" },
]

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "new", label: "New" },
  { value: "top_earners", label: "Top Earners" },
  { value: "top_rated", label: "Top Rated" },
]

function truncateAddress(address: string): string {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatUsageCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`
  return count.toString()
}

function formatPrice(price: number): string {
  if (price === 0) return "Free"
  if (price < 0.001) return `$${price.toFixed(6)}`
  if (price < 0.01) return `$${price.toFixed(4)}`
  return `$${price.toFixed(3)}`
}

function isNewSkill(createdAt: number): boolean {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  return createdAt > thirtyDaysAgo
}

function isTrending(skill: { usageCount: number; avgRating: number }): boolean {
  return skill.usageCount >= 1000000 || skill.avgRating >= 4.8
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

function SkillCard({
  skill,
  showTrending = false,
}: {
  skill: (typeof MOCK_SKILLS)[0]
  showTrending?: boolean
}) {
  const isNew = isNewSkill(skill.createdAt)

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/50">
      {showTrending && (
        <div className="absolute -right-8 -top-4 rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-1">
          <span className="text-xs font-semibold text-white">Trending</span>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg font-semibold truncate">{skill.name}</CardTitle>
              <Badge variant="secondary" className="text-xs font-mono">
                v{skill.version}
              </Badge>
              {isNew && (
                <Badge variant="default" className="bg-gradient-to-r from-violet-500 to-purple-500 text-xs">
                  <Sparkles className="mr-1 h-3 w-3" />
                  New
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {truncateAddress(skill.author).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground font-mono">
                {truncateAddress(skill.author)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-2 text-sm">
          {skill.description}
        </CardDescription>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs capitalize">
            {skill.category.replace("-", " / ")}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <RatingStars rating={skill.avgRating} />
          <span className="text-xs text-muted-foreground">
            {formatUsageCount(skill.usageCount)} uses
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-semibold">{formatPrice(skill.pricePerInvocation)}</span>
          <span className="text-xs text-muted-foreground">per invocation</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SkillsBrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const filteredAndSortedSkills = useMemo(() => {
    let skills = [...MOCK_SKILLS]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      skills = skills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      skills = skills.filter((skill) => skill.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case "popular":
        skills.sort((a, b) => b.usageCount - a.usageCount)
        break
      case "new":
        skills.sort((a, b) => b.createdAt - a.createdAt)
        break
      case "top_rated":
        skills.sort((a, b) => b.avgRating - a.avgRating)
        break
      case "top_earners":
        // Mock: sort by price * usage as proxy for earnings
        skills.sort((a, b) => b.pricePerInvocation * b.usageCount - a.pricePerInvocation * a.usageCount)
        break
    }

    return skills
  }, [searchQuery, selectedCategory, sortBy])

  const trendingSkills = useMemo(
    () => MOCK_SKILLS.filter((skill) => isTrending(skill)),
    []
  )

  const regularSkills = useMemo(
    () => filteredAndSortedSkills.filter((skill) => !isTrending(skill)),
    [filteredAndSortedSkills]
  )

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skill Registry</h1>
          <p className="text-muted-foreground mt-1">
            {MOCK_SKILLS.length} skills available
          </p>
        </div>
        <Button>
          <Link href="/browse">
            <Sparkles className="mr-2 h-4 w-4" />
            New Skill
          </Link>
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v ?? selectedCategory)}>
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          {CATEGORIES.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Trending Skills Section */}
      {trendingSkills.length > 0 && !searchQuery && selectedCategory === "all" && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Trending Skills</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trendingSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} showTrending />
            ))}
          </div>
        </section>
      )}

      {/* All Skills Grid */}
      <section className="space-y-4">
        {trendingSkills.length > 0 && !searchQuery && selectedCategory === "all" && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">All Skills</h2>
          </div>
        )}
        {filteredAndSortedSkills.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-1">No skills found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}