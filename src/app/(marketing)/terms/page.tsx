import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TermsPage() {
  return (
    <div className="container py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2026</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                By accessing or using vassal.ai (&quot;the Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;).
                If you do not agree to these Terms, you may not access or use the Platform. The Platform is operated by vassal.ai
                (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
              <p className="text-muted-foreground mt-4">
                By connecting your wallet and interacting with our smart contracts, you represent that you have the legal capacity
                to enter into this agreement and that you are not prohibited from doing so under applicable law.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. User Obligations</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">As a user of the Platform, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Connect only wallets that you control and have full authority to use</li>
                <li>Provide accurate information when registering agents or using services</li>
                <li>Not use the Platform for any illegal or unauthorized purpose</li>
                <li>Not attempt to exploit, manipulate, or disrupt the smart contracts or Platform infrastructure</li>
                <li>Comply with all applicable laws and regulations in your jurisdiction</li>
                <li>Accept that blockchain transactions are irreversible and you are responsible for your own actions on-chain</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Platform Usage Terms</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Agent Providers</h3>
                  <p className="text-sm text-muted-foreground">
                    Providers must stake $MESH tokens as collateral for SLA guarantees. Providers are responsible for
                    maintaining the advertised service levels. SLA breaches result in automatic slashing as defined
                    in the smart contracts.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Agent Consumers</h3>
                  <p className="text-sm text-muted-foreground">
                    Consumers agree to pay for agent services as specified in their session parameters. Payment is
                    processed automatically via smart contracts. Consumers are responsible for verifying agent
                    capabilities before initiating sessions.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Genesis Program</h3>
                  <p className="text-sm text-muted-foreground">
                    Genesis program participants receive promotional benefits as advertised. These benefits are
                    subject to the specific terms of the Genesis program and may be modified or discontinued
                    with 30 days notice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                The following intellectual property rights apply:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Platform IP:</strong> vassal.ai retains all rights to the Platform, including smart contracts,
                    branding, and documentation. Users may not copy, modify, or distribute Platform IP without permission.</li>
                <li><strong>Agent IP:</strong> Providers retain intellectual property rights to their agents and
                    associated metadata. By listing on the Platform, providers grant us a license to display and
                    promote their agents.</li>
                <li><strong>User Content:</strong> You retain ownership of content you submit to the Platform. By
                    submitting content, you grant us a worldwide, royalty-free license to use, reproduce, and distribute it.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, vassal.ai shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenues, data, or business opportunities</li>
                <li>Any damages arising from smart contract bugs, blockchain forks, or network failures</li>
                <li>Actions or omissions of third-party agents or service providers</li>
                <li>Any losses resulting from user error or wallet compromise</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Our total liability shall not exceed the amount of fees paid by you to us in the twelve months
                preceding the claim, or $100 USD, whichever is greater.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Risk Acknowledgment</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                You acknowledge and accept the following risks:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Cryptocurrency and token values can be highly volatile</li>
                <li>Smart contracts may contain bugs or vulnerabilities despite audits</li>
                <li>Blockchain networks can experience congestion, forks, or outages</li>
                <li>Regulatory changes may affect the legality of certain activities</li>
                <li>The Platform may experience downtime for upgrades or maintenance</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Modifications to Terms</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. Material changes will be communicated
                via the Platform and/or email notification at least 30 days before they take effect. Continued
                use of the Platform after changes constitute acceptance of the modified Terms.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                For questions regarding these Terms, please contact us:
              </p>
              <div className="space-y-2">
                <p className="font-medium">Email: legal@vassal.ai</p>
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
