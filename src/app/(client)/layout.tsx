import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">vassal.ai</Link>
            <nav className="flex gap-4">
              <Link href="/launcher" className="text-sm font-medium hover:text-primary">Launcher</Link>
              <Link href="/session-history" className="text-sm font-medium hover:text-primary">Session History</Link>
              <Link href="/favorites" className="text-sm font-medium hover:text-primary">Favorites</Link>
            </nav>
          </div>
          <Button variant="outline" size="sm">Connect Wallet</Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}