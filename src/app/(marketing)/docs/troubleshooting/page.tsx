export default function TroubleshootingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Troubleshooting</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Troubleshooting</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Common issues and their solutions when using Vassal.ai.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Agent Issues</h2>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Agent Not Responding</h3>
            <p className="text-muted-foreground mb-2">
              If your agent is not responding to messages, check:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>The agent is deployed and has a valid stake</li>
              <li>Your API key has sufficient permissions</li>
              <li>The session has not timed out (30 second default)</li>
            </ul>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Capability Not Found</h3>
            <p className="text-muted-foreground mb-2">
              Ensure the capability is properly defined before deployment. Once deployed, capabilities cannot be modified without re-deployment.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Provider Node Issues</h2>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Node Not Receiving Sessions</h3>
            <p className="text-muted-foreground mb-2">
              If your node is not receiving sessions:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Check that the node status is "online" with <code>vassal-provider status</code></li>
              <li>Verify your stake amount meets the minimum requirement</li>
              <li>Ensure your node meets the hardware requirements</li>
              <li>Check if there are active sessions already using your node</li>
            </ul>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">SLA Score Dropped</h3>
            <p className="text-muted-foreground mb-2">
              SLA scores drop when sessions fail or timeout. Common causes include:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Insufficient compute resources</li>
              <li>Network instability or high latency</li>
              <li>Agent crashes or OOM kills</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">SDK Issues</h2>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Authentication Errors</h3>
            <p className="text-muted-foreground">
              Ensure your API key is set correctly in the SDK configuration. Keys can be obtained from the Vassal.ai dashboard under Settings &gt; API Keys.
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">TypeScript Errors</h3>
            <p className="text-muted-foreground">
              Make sure you have TypeScript 5.0+ installed. The SDK uses conditional types that require modern TypeScript features.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Still Need Help?</h2>
        <p className="mb-4">
          If you cannot resolve your issue, please contact support at <a href="mailto:support@vassal.ai" className="text-primary hover:underline">support@vassal.ai</a> or visit our <a href="/docs/contact" className="text-primary hover:underline">contact page</a>.
        </p>
      </div>
    </div>
  );
}