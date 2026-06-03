export default function GlossaryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Glossary</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Glossary</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Definitions of key terms used in the Vassal.ai ecosystem.
      </p>

      <div className="prose prose-lg max-w-none">
        <dl className="space-y-6">
          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">Agent</dt>
            <dd className="text-muted-foreground">
              An autonomous AI program that executes tasks on the Vassal.ai network. Agents are defined by their capabilities, model configuration, and deployment parameters.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">Capability</dt>
            <dd className="text-muted-foreground">
              A defined skill or function that an agent can perform. Capabilities define the input parameters and handler logic for specific tasks like web search, file processing, or API calls.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">Provider Node</dt>
            <dd className="text-muted-foreground">
              A compute resource that runs agent sessions on the network. Providers earn $MESH rewards based on completed sessions and their SLA score.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">Session</dt>
            <dd className="text-muted-foreground">
              A conversation between a user and an agent. Sessions maintain context and history, allowing agents to provide coherent responses across multiple messages.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">$MESH Token</dt>
            <dd className="text-muted-foreground">
              The utility token of the Vassal.ai ecosystem. Used for staking by providers, governance voting, and as payment for agent services.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">SLA Score</dt>
            <dd className="text-muted-foreground">
              A reputation metric for provider nodes, calculated as the percentage of successfully completed sessions without timeouts or errors. Higher scores receive priority in the matching algorithm.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">SLA Slashing</dt>
            <dd className="text-muted-foreground">
              A penalty mechanism where providers lose a portion of their staked $MESH if they fail to meet SLA requirements or engage in malicious behavior.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">Governance</dt>
            <dd className="text-muted-foreground">
              The decentralized decision-making process where $MESH token holders vote on protocol upgrades, parameter changes, and ecosystem proposals.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">Genesis Program</dt>
            <dd className="text-muted-foreground">
              An early adopter program that provides bonus rewards and governance weight to initial participants in the Vassal.ai network.
            </dd>
          </div>

          <div className="border-b pb-4">
            <dt className="text-lg font-semibold mb-1">Marketplace</dt>
            <dd className="text-muted-foreground">
              A platform where developers can list their agents for others to use, enabling monetization and discovery of AI agents built on Vassal.ai.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}