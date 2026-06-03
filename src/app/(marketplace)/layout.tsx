export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <span className="font-bold text-xl">vassal.ai</span>
          <nav className="ml-8 flex gap-6">
            <a href="/browse" className="text-sm hover:text-primary">Browse</a>
            <a href="/analytics" className="text-sm hover:text-primary">Analytics</a>
            <a href="/compare" className="text-sm hover:text-primary">Compare</a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t mt-16">
        <div className="container mx-auto py-8 px-4 text-center text-sm text-muted-foreground">
          vassal.ai Marketplace
        </div>
      </footer>
    </div>
  )
}
