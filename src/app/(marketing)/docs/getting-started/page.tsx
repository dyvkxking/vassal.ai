export default function GettingStartedPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Getting Started</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn the fundamentals of Vassal.ai and start building decentralized AI agents.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">What is Vassal.ai?</h2>
        <p className="mb-4">
          Vassal.ai is a decentralized compute network for AI agents. It enables developers to deploy autonomous agents that can execute tasks, learn from sessions, and participate in governance. Provider nodes supply compute resources and earn $MESH token rewards.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Key Concepts</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Agents</strong> — Autonomous AI programs that execute tasks on the network</li>
          <li><strong>Provider Nodes</strong> — Compute resources that run agent sessions</li>
          <li><strong>$MESH Token</strong> — Utility token for governance, staking, and payments</li>
          <li><strong>SLA Scoring</strong> — Reputation system that rewards reliable providers</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Prerequisites</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Node.js 18+ or Python 3.10+</li>
          <li>Basic understanding of AI agents and LLM concepts</li>
          <li>A wallet with some $MESH tokens for testnet (obtain from faucet)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Next Steps</h2>
        <p className="mb-4">
          Continue to the <a href="/docs/quick-start" className="text-primary hover:underline">Quick Start guide</a> to build your first agent in under 5 minutes, or explore the <a href="/docs/tutorials" className="text-primary hover:underline">Tutorials</a> for more in-depth guides.
        </p>
      </div>
    </div>
  );
}