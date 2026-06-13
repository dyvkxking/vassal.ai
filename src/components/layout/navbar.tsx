'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { signOut, useSession } from 'next-auth/react'
import { useAccount, useConnect } from 'wagmi'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  { label: 'Home', href: '/provider/home' },
  { label: 'Sessions', href: '/provider/sessions' },
  { label: 'Earnings', href: '/provider/earnings' },
  { label: 'Node Management', href: '/provider/node' },
  { label: 'Stake', href: '/provider/stake' },
]

const BUILDER_LINKS = [
  { label: 'Home', href: '/builder/home' },
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

function UserMenu() {
  const { data: session } = useSession()
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()

  // No OAuth session and no wallet connected
  if (!session?.user && !isConnected) {
    return null
  }

  const user = session?.user
  const displayName = user?.name || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User')
  const userImage = user?.image
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : address ? address.slice(2, 4).toUpperCase() : '??'

  const hasWalletLinked = !!session?.address || isConnected

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-border hover:border-primary transition-colors cursor-pointer">
            {userImage ? (
              <AvatarImage src={userImage} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {/* Wallet status indicator */}
          {hasWalletLinked && (
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" title="Wallet connected" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* User info */}
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{displayName}</p>
          {user?.email && (
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          )}
          {session?.address && (
            <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
              {session.address.slice(0, 10)}...{session.address.slice(-6)}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />

        {/* Wallet status */}
        {!hasWalletLinked && (
          <>
            <div className="px-3 py-2">
              <p className="text-xs text-amber-500">No wallet linked</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 h-8 text-xs"
                onClick={() => connectors[0] && connect({ connector: connectors[0] })}
                disabled={isPending}
              >
                {isPending ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Links */}
        <DropdownMenuItem asChild>
          <Link href="/account/profile">Account Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        {/* Show "Link Wallet" if OAuth user without wallet */}
        {session?.user && !session.address && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/link-wallet" className="text-amber-500">
                🔗 Link Wallet
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Show "Link OAuth" if wallet user without OAuth */}
        {isConnected && !session?.user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/signin" className="text-blue-500">
                🔗 Link Social Account
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isConnected } = useAccount()

  // Show user menu if OAuth session OR wallet connected
  const showUserMenu = !!session?.user || isConnected

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
                    <NavigationMenuLink
                      href="/browse-agents"
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-violet-500/10 to-purple-500/10 p-6 no-underline outline-none focus:shadow-md"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">Agent Marketplace</div>
                      <p className="text-sm text-muted-foreground">
                        Browse and rent specialized AI agents with on-chain SLA guarantees.
                      </p>
                    </NavigationMenuLink>
                  </li>
                  {MARKETPLACE_LINKS.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink
                        href={link.href}
                        className={cn(navigationMenuTriggerStyle(), 'w-full')}
                      >
                        {link.label}
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
                      <NavigationMenuLink
                        href={link.href}
                        className={cn(navigationMenuTriggerStyle(), 'w-full')}
                      >
                        {link.label}
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
                      <NavigationMenuLink
                        href={link.href}
                        className={cn(navigationMenuTriggerStyle(), 'w-full')}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/governance/proposals"
                className={navigationMenuTriggerStyle()}
              >
                Governance
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  {DOCS_LINKS.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink
                        href={link.href}
                        className={cn(navigationMenuTriggerStyle(), 'w-full')}
                      >
                        {link.label}
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
          {showUserMenu ? (
            <UserMenu />
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}