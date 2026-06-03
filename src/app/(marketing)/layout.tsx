import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Vassal.ai</Link>
          <div className="flex gap-6">
            <Link href="/docs">Documentation</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/docs/getting-started">Get Started</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Vassal.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}