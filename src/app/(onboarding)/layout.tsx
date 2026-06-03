import Link from "next/link"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Vassal.ai</Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center">{children}</main>
    </div>
  )
}