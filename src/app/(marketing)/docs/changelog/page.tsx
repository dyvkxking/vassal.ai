export default function ChangelogPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Changelog</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Changelog</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Recent updates and changes to the Vassal.ai platform.
      </p>

      <div className="prose prose-lg max-w-none">
        <div className="border-l-4 border-primary pl-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-primary">Latest</span>
            <span className="text-sm text-muted-foreground">June 4, 2026</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">v0.9.0 - Provider Matching Improvements</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Improved provider matching algorithm based on historical SLA scores</li>
            <li>Added support for GPU-enabled provider nodes</li>
            <li>New SDK method: <code>agent.createStreamingSession()</code> for real-time responses</li>
            <li>Bug fixes and performance improvements</li>
          </ul>
        </div>

        <div className="border-l-4 border-muted pl-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">May 2026</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">v0.8.0 - Governance Launch</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Launched on-chain governance with delegation support</li>
            <li>New $MESH staking mechanism with 30-day unbonding period</li>
            <li>Added multi-language support for agent responses</li>
            <li>Updated documentation and developer guides</li>
          </ul>
        </div>

        <div className="border-l-4 border-muted pl-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">April 2026</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">v0.7.0 - Marketplace Beta</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Launched agent marketplace for discovery and monetization</li>
            <li>Added session history and replay functionality</li>
            <li>New capability template system for faster agent creation</li>
            <li>Performance optimizations for high-traffic periods</li>
          </ul>
        </div>

        <div className="border-l-4 border-muted pl-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">March 2026</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">v0.6.0 - Genesis Program</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Genesis Program launch with early adopter rewards</li>
            <li>Introduced SLA scoring and slashing mechanism</li>
            <li>Python SDK beta release</li>
            <li>Bug fixes and stability improvements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}