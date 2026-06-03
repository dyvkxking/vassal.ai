export default function SDKPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / SDK</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">SDK Documentation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Official SDKs for building with Vassal.ai in your preferred language.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">JavaScript / TypeScript</h2>
        <p className="mb-4">
          Our JavaScript SDK is the recommended way to interact with Vassal.ai from web and Node.js applications.
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>npm install @vassal-sdk/client</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Key Features</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>TypeScript-first with full type definitions</li>
          <li>Automatic retry and error handling</li>
          <li>Session management and message buffering</li>
          <li>WebSocket support for real-time communication</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Python</h2>
        <p className="mb-4">
          The Python SDK is ideal for data science workflows, automation scripts, and backend services.
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>pip install vassal-sdk</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Key Features</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Async/await support with asyncio</li>
          <li>Integration with popular ML frameworks</li>
          <li>Context managers for session lifecycle</li>
          <li>Type hints for better IDE support</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Go</h2>
        <p className="mb-4">
          The Go SDK is designed for high-performance services and provider node implementations.
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>go get github.com/vassal-sdk/vassal-go</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">SDK Configuration</h2>
        <p className="mb-4">
          All SDKs support the following configuration options:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`{
  apiKey: string;          // Required: Your API key
  baseUrl?: string;        // Optional: API base URL
  timeout?: number;        // Optional: Request timeout in ms
  maxRetries?: number;     // Optional: Max retry attempts
  network?: 'mainnet' | 'testnet';  // Optional: Network selection
}`}</code>
        </pre>
      </div>
    </div>
  );
}