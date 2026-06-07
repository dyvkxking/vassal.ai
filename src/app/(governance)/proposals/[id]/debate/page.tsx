"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Clock,
  Users,
  Pin,
  EyeOff,
  Eye,
  AlertCircle,
  Send,
  BarChart3,
  PieChart,
  ChevronUp,
  ChevronDown,
  RefreshCw,
} from "lucide-react"

interface ProposalDebatePageProps {
  params: Promise<{ id: string }>
}

// Mock proposal data
const mockProposal = {
  id: "GIP-042",
  title: "Increase staking reward ratio to 12%",
  status: "active",
  debateEndTime: new Date(Date.now() + 86400000 * 3), // 3 days from now
  currentDebatePhase: "discussion",
}

// Mock discussion thread data
const mockDiscussions = [
  {
    id: "disc-001",
    author: "0xabc1...def1",
    authorName: "StakerPro",
    type: "argument" as const,
    stance: "for",
    content: "This proposal is essential for maintaining network security. With increased competition from other PoS networks, we need competitive rewards to retain validators. The 12% rate aligns with industry standards and will attract more quality validators.",
    votingPower: 450000,
    timestamp: Date.now() - 86400000 * 2,
    pinned: false,
    hidden: false,
    reactions: { upvotes: 45, downvotes: 3 },
    replies: [
      {
        id: "reply-001",
        author: "0xdef2...abc2",
        content: "Strongly agree. The current 8% rate is below market average and we're seeing validator migration.",
        timestamp: Date.now() - 86400000 * 1.5,
        votingPower: 120000,
      },
    ],
  },
  {
    id: "disc-002",
    author: "0xabc2...def2",
    authorName: "CryptoThinker",
    type: "argument" as const,
    stance: "against",
    content: "12% is too aggressive. This will lead to significant token inflation and potentially harm price stability. A more gradual increase to 10% would be safer while still remaining competitive.",
    votingPower: 280000,
    timestamp: Date.now() - 86400000 * 1.8,
    pinned: false,
    hidden: false,
    reactions: { upvotes: 28, downvotes: 12 },
    replies: [],
  },
  {
    id: "disc-003",
    author: "0xabc3...def3",
    authorName: "ValidatorNode",
    type: "question" as const,
    stance: "neutral",
    content: "Can someone explain the inflation impact calculations? I'd like to understand the projected token dilution before making a decision.",
    votingPower: 890000,
    timestamp: Date.now() - 86400000,
    pinned: true,
    hidden: false,
    reactions: { upvotes: 15, downvotes: 0 },
    replies: [
      {
        id: "reply-002",
        author: "0xdef4...abc4",
        content: "Based on current staking ratio of 62%, moving to 12% would increase annual inflation by approximately 2.4%. You can verify this in the economic model spreadsheet.",
        timestamp: Date.now() - 86400000 * 0.5,
        votingPower: 320000,
      },
    ],
  },
  {
    id: "disc-004",
    author: "0xabc4...def4",
    authorName: "MeshDAO_Member",
    type: "argument" as const,
    stance: "for",
    content: "The treasury analysis shows this will actually reduce effective dilution because higher participation increases security and attracts more usage, which offsets the higher reward rate through increased fee revenue.",
    votingPower: 650000,
    timestamp: Date.now() - 3600000 * 6,
    pinned: false,
    hidden: false,
    reactions: { upvotes: 38, downvotes: 7 },
    replies: [],
  },
  {
    id: "disc-005",
    author: "0xabc5...def5",
    authorName: "FUD_Spreader",
    type: "counter" as const,
    stance: "against",
    content: "I disagree with the treasury analysis. The fee revenue projection assumes 3x growth in network activity which hasn't been demonstrated. This feels like optimistic speculation being presented as fact.",
    votingPower: 95000,
    timestamp: Date.now() - 3600000 * 3,
    pinned: false,
    hidden: false,
    reactions: { upvotes: 8, downvotes: 22 },
    replies: [],
  },
]

// Mock community polls
const mockPolls = [
  {
    id: "poll-001",
    question: "What should the new staking reward rate be?",
    options: [
      { label: "8%", votes: 120, percentage: 8 },
      { label: "10%", votes: 450, percentage: 30 },
      { label: "12%", votes: 680, percentage: 45 },
      { label: "15%", votes: 260, percentage: 17 },
    ],
    totalVotes: 1510,
    endsAt: "2026-06-08",
  },
  {
    id: "poll-002",
    question: "Should rewards be adjusted annually based on participation?",
    options: [
      { label: "Yes, automatic", votes: 720, percentage: 52 },
      { label: "Yes, manual vote", votes: 380, percentage: 28 },
      { label: "No, fixed rate", votes: 280, percentage: 20 },
    ],
    totalVotes: 1380,
    endsAt: "2026-06-10",
  },
]

function formatAddress(address: string): string {
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

function formatAmount(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`
  }
  return amount.toLocaleString()
}

function formatTimeRemaining(date: Date): string {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h remaining`
  return "Ending soon"
}

function StanceBadge({ stance }: { stance: string }) {
  const config = {
    for: { icon: ThumbsUp, color: "text-green-600", bg: "bg-green-500/10 border-green-500/20", label: "For" },
    against: { icon: ThumbsDown, color: "text-red-600", bg: "bg-red-500/10 border-red-500/20", label: "Against" },
    neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted border-muted-foreground/20", label: "Neutral" },
  }
  const { icon: Icon, color, bg, label } = config[stance as keyof typeof config] || config.neutral
  return (
    <Badge className={`${bg} ${color} border`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  )
}

function DiscussionItem({
  discussion,
  onPin,
  onHide,
  isAdmin = false,
}: {
  discussion: typeof mockDiscussions[0]
  onPin?: (id: string) => void
  onHide?: (id: string) => void
  isAdmin?: boolean
}) {
  const [showReplies, setShowReplies] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  const typeConfig = {
    argument: { label: "Argument", color: "bg-blue-500/10 text-blue-600" },
    question: { label: "Question", color: "bg-purple-500/10 text-purple-600" },
    counter: { label: "Counter", color: "bg-orange-500/10 text-orange-600" },
    response: { label: "Response", color: "bg-gray-500/10 text-gray-600" },
  }

  const typeStyle = typeConfig[discussion.type] || typeConfig.argument

  return (
    <div className={`p-4 border rounded-lg bg-card ${discussion.hidden ? "opacity-50" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">
            {discussion.authorName || formatAddress(discussion.author)}
          </span>
          <code className="text-xs text-muted-foreground">{formatAddress(discussion.author)}</code>
          <StanceBadge stance={discussion.stance} />
          <Badge variant="outline" className={`text-xs ${typeStyle.color}`}>
            {typeConfig[discussion.type]?.label || "Argument"}
          </Badge>
          {discussion.pinned && (
            <Badge variant="secondary" className="text-xs">
              <Pin className="h-3 w-3 mr-1" />
              Pinned
            </Badge>
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPin?.(discussion.id)}
            >
              <Pin className={`h-4 w-4 ${discussion.pinned ? "text-primary" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onHide?.(discussion.id)}
            >
              {discussion.hidden ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className={`text-sm text-muted-foreground leading-relaxed ${!isExpanded && discussion.content.length > 300 ? "line-clamp-3" : ""}`}>
        {discussion.content}
      </p>
      {discussion.content.length > 300 && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-8"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}

      {/* Atomions and meta */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ChevronUp className="h-4 w-4 mr-1" />
              {discussion.reactions.upvotes}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ChevronDown className="h-4 w-4 mr-1" />
              {discussion.reactions.downvotes}
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatAmount(discussion.votingPower)} power
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(discussion.timestamp).toLocaleDateString()}
          </span>
          {discussion.replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowReplies(!showReplies)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {discussion.replies.length} {discussion.replies.length === 1 ? "reply" : "replies"}
            </Button>
          )}
        </div>
      </div>

      {/* Replies */}
      {showReplies && discussion.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
          {discussion.replies.map((reply) => (
            <div key={reply.id} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">{formatAddress(reply.author)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatAmount(reply.votingPower)} power
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(reply.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PollCard({ poll }: { poll: typeof mockPolls[0] }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          {poll.question}
        </CardTitle>
        <CardDescription>
          {poll.totalVotes.toLocaleString()} votes - Ends {poll.endsAt}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.options.map((option) => (
          <div
            key={option.label}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedOption === option.label
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/50"
            }`}
            onClick={() => setSelectedOption(option.label)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{option.label}</span>
              <span className="text-sm text-muted-foreground">
                {option.percentage}% ({option.votes.toLocaleString()})
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${option.percentage}%` }}
              />
            </div>
          </div>
        ))}
        <Button className="w-full mt-2" disabled={!selectedOption}>
          <Send className="w-4 h-4 mr-2" />
          Submit Vote
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ProposalDebatePage({ params }: ProposalDebatePageProps) {
  const [newArgument, setNewArgument] = useState("")
  const [argumentType, setArgumentType] = useState<"argument" | "question" | "counter">("argument")
  const [argumentStance, setArgumentStance] = useState<"for" | "against" | "neutral">("for")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [discussions, setDiscussions] = useState(mockDiscussions)
  const [activeTab, setActiveTab] = useState("discussion")
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "controversial">("newest")
  const [filterStance, setFilterStance] = useState<"all" | "for" | "against" | "neutral">("all")
  const [isAdmin, setIsAdmin] = useState(false) // In real app, would check admin permissions
  const [showStakeDialog, setShowStakeDialog] = useState(false)
  const [stakeAmount, setStakeAmount] = useState(1000)

  const proposal = mockProposal // In real app, would fetch by params.id

  const handleSubmitArgument = async () => {
    if (!newArgument.trim()) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    setDiscussions([
      {
        id: `disc-${Date.now()}`,
        author: "0xYou...0000",
        authorName: "You",
        type: argumentType,
        stance: argumentStance,
        content: newArgument,
        votingPower: 125000, // In real app, would come from actual voting power
        timestamp: Date.now(),
        pinned: false,
        hidden: false,
        reactions: { upvotes: 0, downvotes: 0 },
        replies: [],
      },
      ...discussions,
    ])

    setNewArgument("")
    setIsSubmitting(false)
    setShowStakeDialog(false)
  }

  const handlePin = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, pinned: !d.pinned } : d))
    )
  }

  const handleHide = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, hidden: !d.hidden } : d))
    )
  }

  const sortedDiscussions = [...discussions].filter((d) => !d.hidden || isAdmin)
    .sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      if (sortBy === "newest") {
        return b.timestamp - a.timestamp
      }
      if (sortBy === "votes") {
        return b.reactions.upvotes - a.reactions.upvotes
      }
      if (sortBy === "controversial") {
        return (b.reactions.upvotes + b.reactions.downvotes) - (a.reactions.upvotes + a.reactions.downvotes)
      }
      return 0
    })
    .filter((d) => filterStance === "all" || d.stance === filterStance)

  const forDiscussions = sortedDiscussions.filter((d) => d.stance === "for")
  const againstDiscussions = sortedDiscussions.filter((d) => d.stance === "against")
  const neutralDiscussions = sortedDiscussions.filter((d) => d.stance === "neutral")

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Back link */}
      <Link
        href={`/governance/proposals/${proposal.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Proposal
      </Link>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="font-mono">
                  {proposal.id}
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  {proposal.status}
                </Badge>
                <Badge variant="secondary">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Debate Phase
                </Badge>
              </div>
              <CardTitle className="text-xl leading-tight">
                {proposal.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTimeRemaining(proposal.debateEndTime)}</span>
              </div>
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => setIsAdmin(!isAdmin)}
              >
                {isAdmin ? "Exit Admin Mode" : "Enter Admin Mode"}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="discussion">
            <MessageSquare className="w-4 h-4 mr-2" />
            Discussion ({discussions.filter((d) => !d.hidden).length})
          </TabsTrigger>
          <TabsTrigger value="polls">
            <PieChart className="w-4 h-4 mr-2" />
            Community Polls ({mockPolls.length})
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="w-4 h-4 mr-2" />
            Debate Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussion" className="space-y-6">
          {/* Filters and sort */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Filter:</Label>
              <select
                value={filterStance}
                onChange={(e) => setFilterStance(e.target.value as typeof filterStance)}
                className="text-sm border rounded-md px-2 py-1 bg-background"
              >
                <option value="all">All</option>
                <option value="for">For</option>
                <option value="against">Against</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Sort:</Label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border rounded-md px-2 py-1 bg-background"
              >
                <option value="newest">Newest</option>
                <option value="votes">Most Voted</option>
                <option value="controversial">Controversial</option>
              </select>
            </div>
          </div>

          {/* Add Argument Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Send className="w-5 h-5" />
                Submit Your Argument
              </CardTitle>
              <CardDescription>
                Stake tokens to submit an argument. Higher stake = more visibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Stance:</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={argumentStance === "for" ? "default" : "outline"}
                      size="sm"
                      className={argumentStance === "for" ? "bg-green-600" : ""}
                      onClick={() => setArgumentStance("for")}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      For
                    </Button>
                    <Button
                      variant={argumentStance === "against" ? "default" : "outline"}
                      size="sm"
                      className={argumentStance === "against" ? "bg-red-600" : ""}
                      onClick={() => setArgumentStance("against")}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Against
                    </Button>
                    <Button
                      variant={argumentStance === "neutral" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setArgumentStance("neutral")}
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      Neutral
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Type:</Label>
                  <select
                    value={argumentType}
                    onChange={(e) => setArgumentType(e.target.value as typeof argumentType)}
                    className="text-sm border rounded-md px-2 py-1 bg-background"
                  >
                    <option value="argument">Argument</option>
                    <option value="question">Question</option>
                    <option value="counter">Counter</option>
                  </select>
                </div>
              </div>

              <Textarea
                placeholder="Share your argument or question..."
                value={newArgument}
                onChange={(e) => setNewArgument(e.target.value)}
                rows={4}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Required stake: 1000 MESH</span>
                </div>
                <Button onClick={() => setShowStakeDialog(true)} disabled={!newArgument.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Argument
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discussion Thread */}
          <div className="space-y-4">
            {/* For arguments */}
            {filterStance === "all" && (
              <div className="space-y-4">
                <h3 className="font-medium text-green-600 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  For ({forDiscussions.length})
                </h3>
                {forDiscussions.map((d) => (
                  <DiscussionItem
                    key={d.id}
                    discussion={d}
                    onPin={handlePin}
                    onHide={handleHide}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}

            {filterStance === "all" && againstDiscussions.length > 0 && (
              <Separator className="my-6" />
            )}

            {/* Against arguments */}
            {filterStance === "all" && (
              <div className="space-y-4">
                <h3 className="font-medium text-red-600 flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" />
                  Against ({againstDiscussions.length})
                </h3>
                {againstDiscussions.map((d) => (
                  <DiscussionItem
                    key={d.id}
                    discussion={d}
                    onPin={handlePin}
                    onHide={handleHide}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}

            {filterStance === "all" && neutralDiscussions.length > 0 && (
              <Separator className="my-6" />
            )}

            {/* Neutral arguments */}
            {(filterStance === "all" || filterStance === "neutral") && (
              <div className="space-y-4">
                <h3 className="font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Questions & Discussion ({neutralDiscussions.length})
                </h3>
                {neutralDiscussions.map((d) => (
                  <DiscussionItem
                    key={d.id}
                    discussion={d}
                    onPin={handlePin}
                    onHide={handleHide}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="polls" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {mockPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Debate Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Debate Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-3xl font-bold">{discussions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Arguments</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{forDiscussions.length}</p>
                  <p className="text-sm text-muted-foreground">For</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-3xl font-bold text-red-600">{againstDiscussions.length}</p>
                  <p className="text-sm text-muted-foreground">Against</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-3xl font-bold text-muted-foreground">{neutralDiscussions.length}</p>
                  <p className="text-sm text-muted-foreground">Neutral</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Argument Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-muted-foreground">Avg. voting power per argument</span>
                  <span className="font-medium">234K MESH</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-muted-foreground">Total engagement</span>
                  <span className="font-medium">1,247 reactions</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-muted-foreground">Pinned arguments</span>
                  <span className="font-medium">{discussions.filter((d) => d.pinned).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onOpenChange={setShowStakeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Argument with Stake</DialogTitle>
            <DialogDescription>
              Stake MESH tokens to submit your argument. Higher stakes gain more visibility.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Stake Amount (MESH)</Label>
              <Input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                min={1000}
                step={100}
              />
              <p className="text-xs text-muted-foreground">Minimum: 1,000 MESH</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your voting power</span>
                <span className="font-medium">125,000 MESH</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStakeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitArgument} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit & Stake"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}