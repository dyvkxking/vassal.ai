"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const docsNavigation = [
  { title: "Getting Started", href: "/docs/getting-started" },
  { title: "Quick Start", href: "/docs/quick-start" },
  { title: "API Reference", href: "/docs/api-reference" },
  { title: "SDK", href: "/docs/sdk" },
  { title: "Tutorials", href: "/docs/tutorials", children: [
    { title: "Build Your First Agent", href: "/docs/tutorials/first-agent" },
    { title: "Run a Provider Node", href: "/docs/tutorials/provider-node" },
  ]},
  { title: "Troubleshooting", href: "/docs/troubleshooting" },
  { title: "Glossary", href: "/docs/glossary" },
  { title: "Changelog", href: "/docs/changelog" },
  { title: "Contact", href: "/docs/contact" },
];

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card shrink-0">
        <nav className="p-4 space-y-1">
          {docsNavigation.map((item) => (
            <div key={item.href}>
              <NavLink href={item.href} isActive={pathname === item.href}>
                {item.title}
              </NavLink>
              {item.children?.map((child) => (
                <div key={child.href} className="ml-4">
                  <NavLink href={child.href} isActive={pathname === child.href}>
                    {child.title}
                  </NavLink>
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}