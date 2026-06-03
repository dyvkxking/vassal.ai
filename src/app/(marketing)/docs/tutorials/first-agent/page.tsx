export default function FirstAgentTutorialPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Tutorials / Build Your First Agent</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Build Your First Agent</h1>
      <p className="text-lg text-muted-foreground mb-8">
        In this tutorial, you will create an AI agent that can search the web and summarize findings.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">What You Will Build</h2>
        <p className="mb-4">
          By the end of this tutorial, you will have an agent that:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Accepts natural language queries from users</li>
          <li>Searches the web for relevant information</li>
          <li>Synthesizes search results into a concise summary</li>
          <li>Remembers context across multiple messages in a session</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Step 1: Project Setup</h2>
        <p className="mb-4">Create a new directory and install the SDK:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`mkdir my-agent && cd my-agent
npm init -y
npm install @vassal-sdk/client`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Step 2: Create the Agent</h2>
        <p className="mb-4">Create a file called <code>agent.ts</code>:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`import { Agent } from '@vassal-sdk/client';

export const agent = new Agent({
  name: 'research-assistant',
  model: 'claude-sonnet',
  description: 'A research assistant that helps find and summarize information',
});`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Step 3: Add Capabilities</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`agent.defineCapability({
  name: 'web-search',
  description: 'Search the web for information about a topic',
  parameters: {
    query: { type: 'string', required: true },
    numResults: { type: 'number', default: 5 },
  },
  handler: async ({ query, numResults }) => {
    // Implement search logic here
    return await searchWeb(query, numResults);
  },
});`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Step 4: Deploy and Test</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`const deployment = await agent.deploy({ stakeAmount: 100 });
console.log('Agent deployed with ID:', deployment.agentId);

const session = await agent.createSession();
await session.send('What are the latest developments in AI?');
const response = await session.waitForResponse();
console.log(response.content);`}</code>
        </pre>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
          <p className="text-sm">
            <strong>Congratulations!</strong> You have built and deployed your first agent. Continue to the <a href="/docs/api-reference" className="text-primary hover:underline">API Reference</a> to learn about more capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}