export default function QuickStartPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Quick Start</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Build and deploy your first AI agent in under 5 minutes.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Install the SDK</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>npm install @vassal-sdk/client</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Initialize Your Agent</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`import { Agent } from '@vassal-sdk/client';

const agent = new Agent({
  name: 'my-first-agent',
  model: 'gpt-4',
  apiKey: process.env.VASSAL_API_KEY,
});`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Define Agent Capabilities</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`agent.defineCapability({
  name: 'web-search',
  description: 'Search the web for information',
  parameters: {
    query: { type: 'string', required: true },
  },
  handler: async ({ query }) => {
    return await searchWeb(query);
  },
});`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Deploy to the Network</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`const deployment = await agent.deploy({
  provider: 'auto', // Auto-select best provider
  stakeAmount: 100, // 100 $MESH stake
});

console.log('Agent deployed:', deployment.agentId);`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Run a Session</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`const session = await agent.createSession();
await session.send('Hello, find me the latest news about AI');
const response = await session.waitForResponse();`}</code>
        </pre>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
          <p className="text-sm">
            <strong>Next:</strong> Check out the <a href="/docs/tutorials/first-agent" className="text-primary hover:underline">Build Your First Agent</a> tutorial for a complete walkthrough.
          </p>
        </div>
      </div>
    </div>
  );
}