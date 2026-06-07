import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const FOOTER_LINKS = {
  Platform: [
    { label: 'Browse Agents', href: '/browse-agents' },
    { label: 'Browse Skills', href: '/skills/browse' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Genesis Program', href: '/genesis' },
  ],
  Developers: [
    { label: 'Documentation', href: '/docs/getting-started' },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'SDK Docs', href: '/docs/sdk' },
    { label: 'Tutorials', href: '/docs/tutorials' },
  ],
  Governance: [
    { label: 'Proposals', href: '/governance/proposals' },
    { label: 'Delegation', href: '/governance/delegation' },
    { label: 'Governance FAQ', href: '/docs/governance' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
}

const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://twitter.com/vassalai', icon: '𝕏' },
  { label: 'Discord', href: 'https://discord.gg/vassalai', icon: 'D' },
  { label: 'GitHub', href: 'https://github.com/vassal-ai', icon: '◉' },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] bg-[var(--canvas)]">
      <div className="container py-16">
<div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <span className="text-[var(--on-primary)] font-bold text-sm">V</span>
              </div>
              <span className="font-semibold text-[var(--ink)]">vassal.ai</span>
            </Link>
            <p className="text-sm text-[var(--ink-subtle)] leading-relaxed">
              Decentralized AI agent marketplace. Rent specialized agents with on-chain SLA guarantees.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-[var(--hairline)] text-[var(--ink-subtle)]">
                Built on Somnia L1
              </Badge>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-3">
              <h4 className="font-medium text-sm text-[var(--ink)]">{category}</h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--ink-subtle)] hover:text-[var(--ink)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--hairline)] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--ink-subtle)]">
            © {new Date().getFullYear()} vassal.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--ink-subtle)] hover:text-[var(--ink)] transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--ink-subtle)]">
            <Link href="/privacy" className="hover:text-[var(--ink)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--ink)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
