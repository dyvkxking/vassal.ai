'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Wallet, Home, Settings, HelpCircle, Users, BarChart3, Layers, Zap, Shield, User, Plus, History, Heart, CreditCard, Bell } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'

const MARKETPLACE_LINKS = [
  { label: 'Browse Agents', href: '/browse-agents', icon: Layers },
  { label: 'Browse Skills', href: '/skills/browse', icon: Zap },
  { label: 'Compare', href: '/compare', icon: BarChart3 },
]

const PROVIDER_LINKS = [
  { label: 'Dashboard', href: '/provider/dashboard', icon: Home },
  { label: 'Sessions', href: '/provider/sessions', icon: Zap },
  { label: 'Earnings', href: '/provider/earnings', icon: BarChart3 },
  { label: 'Node Management', href: '/provider/node', icon: Settings },
  { label: 'Stake', href: '/provider/stake', icon: Shield },
]

const BUILDER_LINKS = [
  { label: 'Dashboard', href: '/builder/dashboard', icon: Home },
  { label: 'My Agents', href: '/builder/my-agents', icon: Layers },
  { label: 'Create Agent', href: '/builder/create-agent', icon: Plus },
  { label: 'Analytics', href: '/builder/analytics', icon: BarChart3 },
  { label: 'Learning Logs', href: '/builder/learning-logs', icon: Settings },
]

const CLIENT_LINKS = [
  { label: 'Launcher', href: '/launcher', icon: Zap },
  { label: 'Session History', href: '/session-history', icon: History },
  { label: 'Favorites', href: '/favorites', icon: Heart },
  { label: 'Payments', href: '/payments', icon: CreditCard },
]

const ACCOUNT_LINKS = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Help', href: '/help', icon: HelpCircle },
]

function NavSection({ title, links, pathname }: { title: string; links: { label: string; href: string; icon: React.ComponentType<{className?: string}> }[]; pathname: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">{title}</h3>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon as React.ComponentType<{className?: string}>
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-lg">vassal.ai</span>
          </Link>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <NavSection title="Marketplace" links={MARKETPLACE_LINKS} pathname={pathname} />
          <NavSection title="Provider" links={PROVIDER_LINKS} pathname={pathname} />
          <NavSection title="Builder" links={BUILDER_LINKS} pathname={pathname} />
          <NavSection title="Client" links={CLIENT_LINKS} pathname={pathname} />
          <div className="border-t border-border pt-4">
            <NavSection title="Account" links={ACCOUNT_LINKS} pathname={pathname} />
          </div>
        </div>

        {/* Footer with Wallet Connect */}
        <div className="border-t border-border p-4 space-y-3">
          <ConnectButton
            chainStatus="icon"
            accountStatus="avatar"
            showBalance={false}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}