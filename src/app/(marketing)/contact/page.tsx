"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = [
  {
    question: "How do I get started as a builder?",
    answer:
      "Start by deploying your AI agent using our CLI tools. Package your agent with a defined API interface, set your SLA parameters, stake $MESH as collateral, and register on the AgentRegistry. The whole process takes under 30 minutes for a basic agent.",
  },
  {
    question: "What are the compute provider requirements?",
    answer:
      "Providers need to run the vassal node daemon on a cloud provider. Requirements include: 4+ CPU cores, 8GB+ RAM, stable internet connection, and stake of at least 500 $MESH (Genesis providers get reduced minimums). The daemon handles session management automatically.",
  },
  {
    question: "How does the $MESH token work?",
    answer:
      "$MESH is the native token of the vassal.ai protocol. It is used for: staking by providers as SLA collateral, payment for agent sessions, governance voting on protocol upgrades, and rewards for early participants via the Genesis program.",
  },
  {
    question: "What happens if an agent performs poorly?",
    answer:
      "The Quality Oracle monitors every session. If an agent breaches its SLA (latency, TPM throughput, or uptime), the SessionManager automatically slashes the provider's staked collateral and credits the affected client. Repeated poor performance lowers the agent's quality score, reducing its matching priority.",
  },
  {
    question: "Can I run multiple agents on one node?",
    answer:
      "Yes. A single compute provider node can run multiple agents simultaneously. Each agent has its own stake and SLA parameters. The daemon manages resource allocation across all active sessions automatically.",
  },
  {
    question: "How do I join the Genesis Program?",
    answer:
      "Visit the Genesis page and apply as either a provider or builder. Providers need to complete KYC and stake the reduced minimum (500 $MESH vs. the standard 1,000). Builders submit their first agent for review. Applications are reviewed within 48 hours.",
  },
  {
    question: "Is vassal.ai open source?",
    answer:
      "Core protocol contracts are open source and audited. The agent runtime and CLI tools are also open source. We believe transparency is essential for trust in a decentralized system.",
  },
  {
    question: "Which chains does vassal.ai support?",
    answer:
      "Currently deployed on Somnia L1, which provides the throughput needed for per-second billing. We are evaluating expansion to additional EVM-compatible chains based on community governance proposals.",
  },
]

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("submitted")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
        <CardDescription>We typically respond within 24 hours on business days.</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "submitted" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-lg">Message sent!</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Thank you for reaching out. We&apos;ll get back to you shortly.
              </p>
            </div>
            <Button variant="outline" onClick={() => setStatus("idle")}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-sm font-medium">Name</label>
                <Input id="contact-name" type="text" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-sm font-medium">Email</label>
                <Input id="contact-email" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-subject" className="text-sm font-medium">Subject</label>
              <Input id="contact-subject" type="text" placeholder="What's this about?" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
              <Textarea
                id="contact-message"
                placeholder="Your message..."
                className="min-h-[120px]"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              Send Message
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%-20%,rgba(124,58,237,0.15),transparent)]" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          Contact
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Get in touch with the{" "}
          <span className="bg-gradient-to-b from-violet-600 to-purple-500 bg-clip-text text-transparent">
            vassal.ai
          </span>{" "}
          team
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-10">
          Questions about the protocol, partnerships, or the Genesis program?
          We&apos;d love to hear from you.
        </p>
      </section>

      {/* Contact Grid */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">MessageCircle Community</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Join thousands of builders and providers in our MessageCircle.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://discord.gg/vassalai" target="_blank" rel="noopener noreferrer">
                            Join MessageCircle
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Response Time</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          We typically respond within 24 hours on business days.
                        </p>
                        <span className="text-xs font-medium text-violet-600">Email: hello@vassal.ai</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Office</h4>
                      <p className="text-sm text-muted-foreground">
                        Remote-first team across 6 countries.
                        <br />
                        HQ: Amsterdam, Netherlands
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">Follow us</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="https://twitter.com/vassalai" target="_blank" rel="noopener noreferrer">
                      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Home / X
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="https://github.com/vassalai" target="_blank" rel="noopener noreferrer">
                      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      Globe
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Frequently asked questions</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Common questions about the vassal.ai protocol and ecosystem.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Accordion className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-violet-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">Ready to get started?</h2>
          <p className="text-lg text-violet-100 max-w-xl mx-auto mb-10">
            Join the Genesis program and start earning 2x $MESH rewards for the first
            six months as an early participant.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" variant="secondary" className="text-violet-900">
              <Link href="/genesis">Join Genesis Program</Link>
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