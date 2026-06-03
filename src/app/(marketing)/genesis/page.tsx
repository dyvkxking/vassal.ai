import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GenesisPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Genesis Program</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join the founding members of Vassal.ai and unlock exclusive benefits during our launch period.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Provider Benefits</CardTitle>
            <CardDescription>Earn 2x rewards during Genesis</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">2x</span> multiplier on all earnings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">Priority</span> node activation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">Genesis</span> badge on profile
              </li>
            </ul>
            <Link href="/genesis/provider" className="mt-4 block">
              <Button variant="outline" className="w-full">View Details</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Builder Benefits</CardTitle>
            <CardDescription>Free listings and reduced fees</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">3 free</span> agent listings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">0%</span> platform fees during Genesis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">Featured</span> placement in marketplace
              </li>
            </ul>
            <Link href="/genesis/builder" className="mt-4 block">
              <Button variant="outline" className="w-full">View Details</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Common questions answered</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>Program timeline</li>
              <li>Qualification requirements</li>
              <li>Reward calculations</li>
              <li>Late enrollment</li>
            </ul>
            <Link href="/genesis/faq" className="mt-4 block">
              <Button variant="outline" className="w-full">View FAQ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Links */}
      <div className="flex justify-center gap-4">
        <Link href="/genesis/provider">
          <Button variant="default">Provider Portal</Button>
        </Link>
        <Link href="/genesis/builder">
          <Button variant="default">Builder Portal</Button>
        </Link>
        <Link href="/genesis/faq">
          <Button variant="secondary">FAQ</Button>
        </Link>
      </div>
    </div>
  )
}