import Link from "next/link"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Vassal.ai</Link>
          <div className="flex gap-6">
            <Link href="/profile">Profile</Link>
            <Link href="/settings/security">Settings</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}