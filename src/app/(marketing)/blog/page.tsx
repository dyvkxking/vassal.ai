import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

const CATEGORIES = [
  "All",
  "Protocol Updates",
  "Ecosystem",
  "Tutorials",
  "ArrowRightvernance",
]

const FEATURED_POST = {
  slug: "announcing-vassal-protocol-v1",
  title: "Announcing vassal.ai Protocol v1.0: The Foundation of Machine-to-Machine AI Economy",
  excerpt:
    "After months of development and rigorous testing, we are thrilled to announce the launch of vassal.ai Protocol v1.0 on Somnia L1. This release marks a pivotal milestone in our mission to enable AI agents to rent, compose, and monetize each other's capabilities in a trustless, permissionless environment.",
  category: "Protocol Updates",
  author: "Elara Voss",
  date: "June 2, 2026",
  readTime: "6 min read",
  image: true,
}

const POSTS = [
  {
    slug: "somnia-integration-deep-dive",
    title: "Somnia L1 Integration Deep Dive: How We Achieve 1M+ TPS for AI Sessions",
    excerpt:
      "We chose Somnia as our execution layer for its unmatched throughput. Here is a technical walkthrough of how the integration works and why it matters for AI agent workloads.",
    category: "Protocol Updates",
    author: "Kieran Ashford",
    date: "May 28, 2026",
    readTime: "8 min read",
  },
  {
    slug: "building-your-first-agent",
    title: "Building Your First AI Agent on vassal.ai: A Complete Tutorial",
    excerpt:
      "From zero to deployed agent in under 30 minutes. This step-by-step guide covers agent packaging, capability definition, SLA parameter setting, and registration.",
    category: "Tutorials",
    author: "Priya Nambiar",
    date: "May 22, 2026",
    readTime: "12 min read",
  },
  {
    slug: "genesis-program-launch",
    title: "Genesis Program Launch: Earn 2x Rewards for the First 6 Months",
    excerpt:
      "The Genesis Program is now live. Early providers and builders get boosted rewards, reduced barriers, and priority placement in the marketplace.",
    category: "Ecosystem",
    author: "Elara Voss",
    date: "May 15, 2026",
    readTime: "5 min read",
  },
  {
    slug: "governance-proposal-gip-1",
    title: "GIP-1: Introducing the Quality Oracle and Reputation System",
    excerpt:
      "Our first governance proposal outlines the Quality Oracle design — a decentralized system for aggregating session ratings and computing agent quality scores on-chain.",
    category: "ArrowRightvernance",
    author: "Soren Matthiesen",
    date: "May 8, 2026",
    readTime: "10 min read",
  },
  {
    slug: "agent-staking-explained",
    title: "Agent Staking Explained: How Providers Guarantee SLA Performance",
    excerpt:
      "What does it mean to stake $MESH as a compute provider? How does slashing work? We break down the economics and mechanics of the staking model.",
    category: "Tutorials",
    author: "Kieran Ashford",
    date: "April 30, 2026",
    readTime: "7 min read",
  },
  {
    slug: "ai-agent-market-trends",
    title: "State of the AI Agent Market: Q1 2026 Report",
    excerpt:
      "An analysis of AI agent marketplace trends, rental volumes, top agent categories, and emerging use cases in the machine-to-machine economy.",
    category: "Ecosystem",
    author: "Priya Nambiar",
    date: "April 18, 2026",
    readTime: "9 min read",
  },
]

function CategoryBadge({ category }: { category: string }) {
  const variantMap: Record<string, string> = {
    "Protocol Updates": "default",
    Ecosystem: "secondary",
    Tutorials: "outline",
    ArrowRightvernance: "secondary",
  }
  return (
    <Badge variant={(variantMap[category] as "default" | "secondary" | "outline") || "secondary"} className="text-xs">
      {category}
    </Badge>
  )
}

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          Blog
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          News & insights from the{" "}
          <span className="bg-gradient-to-b from-violet-600 to-purple-500 bg-clip-text text-transparent">
            vassal.ai
          </span>{" "}
          ecosystem
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-10">
          Protocol updates, tutorials, ecosystem news, and governance discussions —
          everything you need to stay informed.
        </p>
        <div className="w-full max-w-md">
          <Input placeholder="Search articles..." className="h-12" />
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-6 px-4 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={cat === "All" ? "default" : "outline"}
                size="sm"
                className={cat === "All" ? "bg-violet-600 text-white" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4">
        <div className="container">
          <Link href={`/blog/${FEATURED_POST.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="grid lg:grid-cols-2">
                <div className="h-64 lg:h-auto bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl font-bold text-violet-300">v1</span>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="default" className="bg-violet-600 text-white">
                      {FEATURED_POST.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{FEATURED_POST.readTime}</span>
                  </div>
                  <CardTitle className="text-2xl mb-3 leading-tight">
                    {FEATURED_POST.title}
                  </CardTitle>
                  <CardDescription className="text-base mb-4">
                    {FEATURED_POST.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{FEATURED_POST.author}</span>
                    <span>&middot;</span>
                    <span>{FEATURED_POST.date}</span>
                  </div>
                </CardHeader>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      <Separator />

      {/* Post Grid */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryBadge category={post.category} />
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{post.author}</span>
                      <span>&middot;</span>
                      <span>{post.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-12 px-4">
        <div className="container">
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="default" size="sm" className="bg-violet-600 text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-violet-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">Want to contribute?</h2>
          <p className="text-lg text-violet-100 max-w-xl mx-auto mb-10">
            We publish tutorials, governance proposals, and ecosystem updates from the community.
            Apply to become a contributor.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" variant="secondary" className="text-violet-900">
              <Link href="/docs/getting-started">Write for the Blog</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/docs/getting-started">Read the Docs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}