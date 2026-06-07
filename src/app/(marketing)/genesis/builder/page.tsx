"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const LISTING_FEE_WAIVERS = [
  { tier: "Genesis Builder", fee: "Free", duration: "3 months" },
  { tier: "Standard Builder", fee: "5 $MESH", duration: "per listing" },
]

function FreeListingTracker() {
  const listingsUsed = 2
  const totalAllowed = 5
  const daysRemaining = 87

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Free Listing Status</CardTitle>
          <Badge className="bg-emerald-600 text-white">Active</Badge>
        </div>
        <CardDescription>Your Genesis builder free listing tracker</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Days Remaining</p>
            <p className="text-3xl font-bold text-emerald-600">{daysRemaining}</p>
            <p className="text-xs text-muted-foreground">in your 3-month Genesis period</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Genesis Period</p>
            <p className="text-lg font-semibold">Dec 2025 - Mar 2026</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Agent submissions</span>
            <span className="font-medium">{listingsUsed} of {totalAllowed} free listings used</span>
          </div>
          <Progress value={(listingsUsed / totalAllowed) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

function ListingFeeWaiverDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Fee Waiver</CardTitle>
        <CardDescription>Genesis builders enjoy reduced listing costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {LISTING_FEE_WAIVERS.map((waiver) => (
          <div
            key={waiver.tier}
            className={`flex items-center justify-between rounded-lg p-4 ${
              waiver.fee === "Free"
                ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                : "bg-muted/50"
            }`}
          >
            <div>
              <p className="font-semibold text-sm">{waiver.tier}</p>
              <p className="text-xs text-muted-foreground">{waiver.duration}</p>
            </div>
            <Badge variant={waiver.fee === "Free" ? "default" : "secondary"} className={waiver.fee === "Free" ? "bg-emerald-600 text-white" : ""}>
              {waiver.fee}
            </Badge>
          </div>
        ))}
        <p className="text-xs text-muted-foreground pt-2">
          After your Genesis period ends, standard listing fees apply. Your free listings reset each month.
        </p>
      </CardContent>
    </Card>
  )
}

function AgentSubmissionCounter() {
  const submissions = [
    { name: "Code Assistant Pro", status: "Approved", featured: true },
    { name: "Data Analytics Agent", status: "In Review", featured: false },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Submission Counter</CardTitle>
        <CardDescription>Track your Genesis free listings usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-violet-50 dark:bg-violet-900/20 p-4">
            <p className="text-2xl font-bold text-violet-600">2</p>
            <p className="text-xs text-muted-foreground">Used</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4">
            <p className="text-2xl font-bold text-emerald-600">5</p>
            <p className="text-xs text-muted-foreground">Total Allowed</p>
          </div>
        </div>
        <div className="space-y-3 pt-4">
          {submissions.map((agent) => (
            <div key={agent.name} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.status}</p>
                </div>
              </div>
              {agent.featured && (
                <Badge variant="default" className="bg-amber-500 text-white">Featured</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RequirementsToMaintain() {
  const requirements = [
    { title: "Builder Profile", desc: "Complete your builder profile registration with verified contact information." },
    { title: "Agent Review", desc: "Submit at least one agent for security audit within 30 days of joining." },
    { title: "Active Listings", desc: "Maintain at least one active, featured agent listing during Genesis period." },
    { title: "Compliance", desc: "Agree to and comply with Genesis program terms of service." },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requirements to Maintain Status</CardTitle>
        <CardDescription>Keep your Genesis builder benefits active</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements.map((req) => (
          <div key={req.title} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm">{req.title}</h4>
              <p className="text-xs text-muted-foreground">{req.desc}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function FeaturedPlacementInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Placement</CardTitle>
        <CardDescription>How Genesis builders get featured visibility</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Premium Placement</p>
              <p className="text-xs text-muted-foreground">Your agents appear in the featured carousel on the marketplace homepage</p>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <svg className="size-4 mt-0.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            Featured in category top lists
          </li>
          <li className="flex items-start gap-2">
            <svg className="size-4 mt-0.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            Priority in search results
          </li>
          <li className="flex items-start gap-2">
            <svg className="size-4 mt-0.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            Dedicated builder support channel
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

export default function GenesisBuilderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge className="mb-6 px-4 py-1.5 text-sm bg-purple-600 text-white">
          Free Listings Active
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Genesis Builder
          <br />
          <span className="bg-gradient-to-b from-purple-600 to-violet-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-10">
          Track your free listings, manage featured placement, and grow your agent portfolio as a Genesis builder.
        </p>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
          <Link href="/genesis/how-to-join">View How to Join</Link>
        </Button>
      </section>

      {/* Status Tracker */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <FreeListingTracker />
            <AgentSubmissionCounter />
          </div>
        </div>
      </section>

      {/* Details Cards */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <ListingFeeWaiverDetails />
            <FeaturedPlacementInfo />
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <RequirementsToMaintain />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Start Building Your Agent Portfolio
          </h2>
          <p className="text-lg text-purple-100 max-w-xl mx-auto mb-10">
            Submit your first agent and get featured placement on the vassal.ai marketplace.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-purple-900"
            >
              <Link href="/genesis/how-to-join">Apply as Builder</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              <Link href="/genesis/faq">View FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}