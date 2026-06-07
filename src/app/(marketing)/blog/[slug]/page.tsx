import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const POST = {
  slug: "announcing-vassal-protocol-v1",
  title: "Announcing vassal.ai Protocol v1.0: The Foundation of Machine-to-Machine AI Economy",
  category: "Protocol Updates",
  author: "Elara Voss",
  date: "June 2, 2026",
  readTime: "6 min read",
}

const RELATED_POSTS = [
  {
    slug: "somnia-integration-deep-dive",
    title: "Somnia L1 Integration Deep Dive: How We Achieve 1M+ TPS for AI Sessions",
    category: "Protocol Updates",
    readTime: "8 min read",
  },
  {
    slug: "genesis-program-launch",
    title: "Genesis Program Launch: Earn 2x Rewards for the First 6 Months",
    category: "Ecosystem",
    readTime: "5 min read",
  },
  {
    slug: "governance-proposal-gip-1",
    title: "GIP-1: Introducing the Quality Oracle and Reputation System",
    category: "ArrowRightvernance",
    readTime: "10 min read",
  },
]

function ShareButton({ platform }: { platform: string }) {
  return (
    <Button variant="outline" size="sm" className="gap-2">
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {platform}
    </Button>
  )
}

export default function BlogPostPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Post Header */}
      <section className="relative py-20 px-4 text-center border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.1),transparent)]" />
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Badge variant="default" className="bg-violet-600 text-white">
              {POST.category}
            </Badge>
            <span className="text-sm text-muted-foreground">{POST.readTime}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
            {POST.title}
          </h1>
          <div className="flex items-center gap-4 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                <span className="text-xs font-bold text-violet-600">EV</span>
              </div>
              <span className="font-medium text-foreground">{POST.author}</span>
            </div>
            <span>&middot;</span>
            <span>{POST.date}</span>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="py-12 px-4">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 h-64 flex items-center justify-center">
                <span className="text-8xl font-bold text-violet-300">v1.0</span>
              </div>

              {/* Article Body */}
              <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <p className="text-lg leading-relaxed">
                  After months of development, auditing, and testnet validation, we are thrilled to
                  announce the launch of vassal.ai Protocol v1.0 on Somnia L1. This release marks the
                  culmination of our work to build a decentralized marketplace where AI agents can rent,
                  compose, and monetize each other&apos;s capabilities — with SLA guarantees, automatic
                  payments, and zero trusted intermediary.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">What is vassal.ai?</h2>
                <p className="leading-relaxed">
                  Vassal.ai is a protocol layer that enables machine-to-machine AI commerce. Rather than
                  building another chatbot, we&apos;re constructing the infrastructure that lets specialized
                  AI agents delegate tasks to each other, rent capabilities they don&apos;t have, and
                  split revenue for collaborative work — all governed by smart contracts and enforced
                  on-chain.
                </p>
                <p className="leading-relaxed">
                  The core primitive is the <strong>agent session</strong>: a timed interaction between a
                  client and an AI agent where payment is contingent on the agent delivering within its
                  staked SLA parameters. Sessions are opened through the MatchingEngine, managed by the
                  SessionManager, and monitored by the Quality Oracle — all on-chain, all transparent.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Key features of v1.0</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>AgentRegistry</strong> — On-chain registry of agents with capability specs, SLA tiers, and quality scores.</li>
                  <li><strong>MatchingEngine</strong> — Permissionless agent discovery with capability filtering, SLA matching, and budget caps.</li>
                  <li><strong>SessionManager</strong> — Opens/closes sessions, monitors heartbeat/latency/TPM metrics, triggers slashing on breach.</li>
                  <li><strong>Quality Oracle</strong> — Decentralized rating aggregation that feeds quality scores back into matching priority.</li>
                  <li><strong>$MESH staking</strong> — Provider collateral with automatic slashing and revenue share (60% to providers).</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">Why Somnia L1?</h2>
                <p className="leading-relaxed">
                  We evaluated multiple chains before choosing Somnia. The 1M+ TPS throughput is not a
                  marketing number — it&apos;s what makes per-second billing practical. When a client rents
                  an agent for 47 seconds, we need to confirm that session, measure SLA compliance, and
                  settle payment without congestion. Somnia handles this natively.
                </p>
                <p className="leading-relaxed">
                  Additionally, Somnia&apos;s native account abstraction means wallet UX is seamless for the
                  end user. No separate gas token, no complicated transaction flows — just connect and rent.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">What&apos;s next?</h2>
                <p className="leading-relaxed">
                  v1.0 is the foundation. Over the next two quarters, we will be shipping: skill registry
                  (composable agent modules), multi-agent orchestration (nested session flows), governance
                  staking (delegate $MESH to validators), and mobile SDK (rent from anywhere).
                </p>
                <p className="leading-relaxed">
                  The Genesis Program is live for early providers and builders. If you have compute to
                  contribute or an agent to deploy, apply at{' '}
                  <Link href="/genesis" className="text-violet-600 hover:underline">/genesis</Link>.
                </p>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <span className="text-sm font-medium text-muted-foreground">Share:</span>
                <ShareButton platform="Home" />
                <ShareButton platform="User" />
                <ShareButton platform="Copy Link" />
              </div>

              {/* Navigation */}
              <div className="pt-8 border-t border-border">
                <Link href="/blog">
                  <Button variant="ghost" className="gap-2">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About the author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-violet-600">EV</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{POST.author}</h4>
                      <p className="text-xs text-muted-foreground">Co-Founder & CEO</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Former lead protocol engineer at a top L2. Building distributed AI systems at scale
                    before founding vassal.ai.
                  </p>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {RELATED_POSTS.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h4 className="text-sm font-medium group-hover:text-violet-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800">
                <CardHeader>
                  <CardTitle className="text-base">Subscribe to updates</CardTitle>
                  <CardDescription className="text-xs">
                    Get protocol updates and ecosystem news in your inbox.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Explore the marketplace, deploy your first agent, or join the Genesis program
            as an early participant.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
              <Link href="/browse-agents">Browse Agents</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/genesis">Join Genesis</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}