import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function CookiesPage() {
  return (
    <div className="container py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2026</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Cookies are small text files stored on your device when you visit a website. They help websites
                remember your preferences, understand how you use the site, and improve your overall experience.
                In addition to cookies, we may use similar tracking technologies such as local storage, session
                storage, and pixel tags.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Authentication:</strong> To recognize your wallet connection and maintain your session</li>
                <li><strong>Security:</strong> To detect unauthorized access and protect against fraud</li>
                <li><strong>Analytics:</strong> To understand how visitors interact with our Platform</li>
                <li><strong>Preferences:</strong> To remember your settings and display preferences</li>
                <li><strong>Marketing:</strong> To deliver relevant advertisements on third-party platforms</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Cookie Types We Use</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">Essential Cookies</h3>
                    <Badge variant="default" className="text-xs">Always Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies are required for the Platform to function properly.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Wallet connection session management</li>
                    <li>Load balancing and performance optimization</li>
                    <li>Security monitoring and fraud detection</li>
                    <li>Remembering your acceptance of these Terms</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    Cannot be disabled. Disabling these may result in Platform malfunction.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">Analytics Cookies</h3>
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies help us understand how visitors use our Platform.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Page views and navigation patterns</li>
                    <li>Time spent on Platform features</li>
                    <li>Error and performance metrics</li>
                    <li>User journey and conversion tracking</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    You can opt out of analytics cookies in your preferences.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">Marketing Cookies</h3>
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    These cookies are used to deliver relevant advertisements.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Tracking across third-party websites</li>
                    <li>Delivering personalized advertisements</li>
                    <li>Measuring advertisement effectiveness</li>
                    <li>Understanding user interests for targeting</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    You can opt out of marketing cookies in your preferences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Managing Your Cookie Preferences</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                You can manage your cookie preferences in the following ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Platform Settings:</strong> Use the cookie consent banner when first visiting to accept or customize preferences</li>
                <li><strong>Wallet Preferences:</strong> Some preferences are stored with your wallet connection</li>
                <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through settings</li>
                <li><strong>Opt-Out Links:</strong> Use the opt-out links provided by advertising networks</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Note: Disabling analytics or marketing cookies will not affect essential cookie functionality.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Some cookies are placed by third-party services that appear on our Platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Analytics Providers:</strong> For aggregated usage statistics and performance monitoring</li>
                <li><strong>Wallet Providers:</strong> For wallet connection integration and authentication</li>
                <li><strong>Advertising Networks:</strong> For delivering relevant advertisements on and off Platform</li>
                <li><strong>Social Media Platforms:</strong> For sharing features and social login integration</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Third-party cookies are governed by the respective privacy policies of those third parties.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our practices or
                for legal, operational, or regulatory reasons. Any changes will be posted on this page with
                an updated &quot;Last updated&quot; date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2">
                <p className="font-medium">Email: privacy@vassal.ai</p>
                <p className="font-medium">MessageCircle: vassal-ai support channel</p>
                <p className="font-medium">Send: @vassalai</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
