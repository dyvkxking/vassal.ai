"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion, ArrowRight, Home, BookOpen } from 'lucide-react'

export default function BlogNotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          404
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
        <FileQuestion className="h-10 w-10 text-amber-500" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Blog Post Not Found</h1>

      <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
        This post may have been removed, is no longer available, or doesn&apos;t exist.
      </p>

      <Card className="mb-8 w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Blog posts may be unpublished if they contain outdated information,
            have been replaced by newer content, or the author has removed them.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <Link href="/blog" className="flex items-center gap-2">
            Browse Blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/docs/getting-started" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            View Docs
          </Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Looking for something else?{" "}
            <Link href="/blog" className="text-primary underline-offset-4 hover:underline">
              Browse all blog posts
            </Link>{" "}
            to discover the latest news, tutorials, and updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}