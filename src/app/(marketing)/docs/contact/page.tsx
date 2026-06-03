export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Contact</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Get in touch with the Vassal.ai team and community.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Support</h2>
        <p className="mb-4">
          For technical support and bug reports, please email <a href="mailto:support@vassal.ai" className="text-primary hover:underline">support@vassal.ai</a>. We typically respond within 24-48 hours.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Community</h2>
        <p className="mb-4">
          Join our community to connect with other developers and builders:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Discord</strong> - Real-time discussion and support</li>
          <li><strong>Twitter/X</strong> - Latest updates and announcements</li>
          <li><strong>GitHub</strong> - Open source repositories and issue tracking</li>
          <li><strong>Forum</strong> - Long-form discussions and feature requests</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Partnerships</h2>
        <p className="mb-4">
          Interested in partnerships or enterprise deployments? Contact us at <a href="mailto:partnerships@vassal.ai" className="text-primary hover:underline">partnerships@vassal.ai</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
        <p className="mb-4">
          For security vulnerabilities or concerns, please see our <a href="/docs/security" className="text-primary hover:underline">security page</a> or contact <a href="mailto:security@vassal.ai" className="text-primary hover:underline">security@vassal.ai</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Office Hours</h2>
        <p className="mb-4">
          We hold weekly office hours every Thursday at 4 PM UTC. Join us to ask questions and provide feedback directly to the team.
        </p>
      </div>
    </div>
  );
}