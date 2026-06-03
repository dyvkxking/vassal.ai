'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const MARKETPLACE_LINKS = [
  { label: 'Browse Agents', href: '/browse-agents' },
  { label: 'Browse Skills', href: '/skills/browse' },
  { label: 'Compare', href: '/compare' },
]

const PROVIDER_LINKS = [
  { label: 'Dashboard', href: '/provider/dashboard' },
  { label: 'Sessions', href: '/provider/sessions' },
  { label: 'Earnings', href: '/provider/earnings' },
  { label: 'Node Management', href: '/provider/node' },
  { label: 'Stake', href: '/provider/stake' },
]

const BUILDER_LINKS = [
  { label: 'Dashboard', href: '/builder/dashboard' },
  { label: 'My Agents', href: '/builder/my-agents' },
  { label: 'Create Agent', href: '/builder/create-agent' },
  { label: 'Analytics', href: '/builder/analytics' },
  { label: 'Learning Logs', href: '/builder/learning-logs' },
]

const GOVERNANCE_LINKS = [
  { label: 'Proposals', href: '/governance/proposals' },
  { label: 'Delegation', href: '/governance/delegation' },
]

const DOCS_LINKS = [
  { label: 'Getting Started', href: '/docs/getting-started' },
  { label: 'API Reference', href: '/docs/api' },
  { label: 'SDK Docs', href: '/docs/sdk' },
  { label: 'FAQ', href: '/docs/faq' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-xl text-foreground">vassal.ai</span>
        </Link>

        {/* Desktop Nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Marketplace</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/browse-agents"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-violet-500/10 to-purple-500/10 p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">Agent Marketplace</div>
                        <p className="text-sm text-muted-foreground">
                          Browse and rent specialized AI agents with on-chain SLA guarantees.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {MARKETPLACE_LINKS.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link href={link.href} className={cn(navigationMenuTriggerStyle(), 'w-full')}>
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>For Providers</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  {PROVIDER_LINKS.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link href={link.href} className={cn(navigationMenuTriggerStyle(), 'w-full')}>
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>For Builders</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  {BUILDER_LINKS.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link href={link.href} className={cn(navigationMenuTriggerStyle(), 'w-full')}>
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/governance/proposals" className={navigationMenuTriggerStyle()}>
                  Governance
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  {DOCS_LINKS.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link href={link.href} className={cn(navigationMenuTriggerStyle(), 'w-full')}>
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ConnectButton
            chainStatus="icon"
            accountStatus="avatar"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  )
}