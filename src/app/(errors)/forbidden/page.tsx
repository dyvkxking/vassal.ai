"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldX, Lock, Mail, AlertCircle } from 'lucide-react'

interface ForbiddenPageProps {
  searchParams: Promise<{
    action?: string
    requiredRole?: string
    returnUrl?: string
  }>
}

export default function ForbiddenPage({ searchParams }: ForbiddenPageProps) {
  // In real implementation, use use() hook to unwrap the promise
  const action = "access this resource"
  const requiredRole = "provider"
  const returnUrl = "/"

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold text-muted/5 select-none">
          403
        </div>
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
        <ShieldX className="h-10 w-10 text-red-500" />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight">Access Forbidden</h1>

      <p className="mb-6 max-w-md text-center text-lg text-muted-foreground">
        This action is not allowed for your account.
      </p>

      <div className="mb-6 w-full max-w-md space-y-3 rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Action Attempted</span>
            </div>
            <p className="font-medium">{action}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Required Role</span>
            </div>
            <code className="text-sm font-mono font-medium">{requiredRole}</code>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg">
          <Link href={returnUrl}>ArrowRight Back</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/welcome" className="flex items-center gap-2">
            Request Access
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Admin
          </Link>
        </Button>
      </div>

      <Card className="mt-12 w-full max-w-md" size="sm">
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            If you believe you should have access,{" "}
            <Link href="/welcome" className="text-primary underline-offset-4 hover:underline">
              submit a request
            </Link>{" "}
            or contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}