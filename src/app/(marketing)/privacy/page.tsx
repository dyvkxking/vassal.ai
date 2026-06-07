import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PrivacyPage() {
  return (
    <div className="container py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2026</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Data Collection</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Account Information:</strong> Wallet address, email (optional), and profile data when you connect your wallet</li>
                <li><strong>Transaction Data:</strong> On-chain transaction records including agent rental sessions, SLA parameters, and payment history</li>
                <li><strong>Agent Metadata:</strong> Information about agents you register including capabilities, pricing, and SLA configurations</li>
                <li><strong>Communication Data:</strong> Messages and support tickets submitted through our platform</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Cookie Policy</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to operate our service. Types of cookies we use:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Essential Cookies</h3>
                  <p className="text-sm text-muted-foreground">Required for wallet connection, session management, and security. Cannot be disabled.</p>
                </div>
                <div>
                  <h3 className="font-medium">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">Help us understand how users interact with our platform to improve user experience.</p>
                </div>
                <div>
                  <h3 className="font-medium">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground">Used to deliver relevant advertisements on third-party platforms. You can opt out of these.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Data Sharing Practices</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                We do not sell your personal data. We may share information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> Third parties who assist in operating our platform (cloud infrastructure, analytics)</li>
                <li><strong>Smart Contract Execution:</strong> On-chain data is publicly visible and cannot be removed</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User Rights (GDPR & Similar Regulations)</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Deletion:</strong> Request deletion of your personal data (subject to on-chain retention)</li>
                <li><strong>Right to Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                <li><strong>Right to Restrict:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Note: On-chain transaction data cannot be deleted due to the immutable nature of blockchain technology.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your data, including encryption in transit and at rest,
                regular security audits, and access controls. However, no method of transmission over the Internet is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                For privacy-related inquiries or to exercise your rights, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="font-medium">Email: privacy@vassal.ai</p>
                <p className="font-medium">MessageCircle: vassal-ai support channel</p>
                <p className="font-medium">Send: @vassalai</p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We will respond to your request within 30 days.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
