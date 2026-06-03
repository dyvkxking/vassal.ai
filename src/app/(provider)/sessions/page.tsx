"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  { value: "active", label: "Active", href: "/sessions/active" },
  { value: "completed", label: "Completed", href: "/sessions/completed" },
  { value: "cancelled", label: "Cancelled", href: "/sessions/cancelled" },
]

export default function SessionsPage() {
  const pathname = usePathname()

  const currentTab = tabs.find(tab => pathname.includes(tab.value))?.value || "active"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sessions</h1>
      </div>

      <Tabs value={currentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link href={tab.href}>{tab.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-8">
        {currentTab === "active" && (
          <p className="text-muted-foreground">Select a tab to view sessions</p>
        )}
        {currentTab === "completed" && (
          <p className="text-muted-foreground">Select a tab to view sessions</p>
        )}
        {currentTab === "cancelled" && (
          <p className="text-muted-foreground">Select a tab to view sessions</p>
        )}
      </div>
    </div>
  )
}