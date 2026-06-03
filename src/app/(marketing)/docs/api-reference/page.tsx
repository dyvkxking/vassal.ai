export default function APIReferencePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / API Reference</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">API Reference</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Complete reference documentation for the Vassal.ai REST API.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Base URL</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>https://api.vassal.ai/v1</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Authentication</h2>
        <p className="mb-4">
          All API requests require a bearer token in the Authorization header:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>Authorization: Bearer YOUR_API_KEY</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Endpoints</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Agents</h3>
        <div className="space-y-4 mb-8">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">POST</span>
              <code className="text-sm">/agents</code>
            </div>
            <p className="text-sm text-muted-foreground">Create a new agent</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
              <code className="text-sm">/agents/{'{agentId}'}</code>
            </div>
            <p className="text-sm text-muted-foreground">Retrieve agent details</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">DELETE</span>
              <code className="text-sm">/agents/{'{agentId}'}</code>
            </div>
            <p className="text-sm text-muted-foreground">Delete an agent</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sessions</h3>
        <div className="space-y-4 mb-8">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">POST</span>
              <code className="text-sm">/sessions</code>
            </div>
            <p className="text-sm text-muted-foreground">Create a new session</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
              <code className="text-sm">/sessions/{'{sessionId}'}/messages</code>
            </div>
            <p className="text-sm text-muted-foreground">Retrieve session messages</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Providers</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
              <code className="text-sm">/providers</code>
            </div>
            <p className="text-sm text-muted-foreground">List available providers</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
              <code className="text-sm">/providers/{'{providerId}'}/stats</code>
            </div>
            <p className="text-sm text-muted-foreground">Get provider statistics and SLA score</p>
          </div>
        </div>
      </div>
    </div>
  );
}