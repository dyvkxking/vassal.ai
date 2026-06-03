import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Welcome to the Vassal.ai documentation. Here you will find everything you need to build, deploy, and manage AI agents on our decentralized compute network.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <p className="text-muted-foreground mb-4">
            New to Vassal.ai? Start here to understand the platform and set up your first agent.
          </p>
          <Link href="/docs/getting-started" className="text-primary hover:underline">
            Get started &rarr;
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
          <p className="text-muted-foreground mb-4">
            Jump right in with a simple agent setup in under 5 minutes.
          </p>
          <Link href="/docs/quick-start" className="text-primary hover:underline">
            Quick start &rarr;
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">API Reference</h2>
          <p className="text-muted-foreground mb-4">
            Complete API documentation for integrating with Vassal.ai services.
          </p>
          <Link href="/docs/api-reference" className="text-primary hover:underline">
            View API docs &rarr;
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">SDK Documentation</h2>
          <p className="text-muted-foreground mb-4">
            Install and configure our SDKs for JavaScript, Python, and more.
          </p>
          <Link href="/docs/sdk" className="text-primary hover:underline">
            View SDK docs &rarr;
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Tutorials</h2>
          <p className="text-muted-foreground mb-4">
            Step-by-step guides for building agents and running provider nodes.
          </p>
          <Link href="/docs/tutorials" className="text-primary hover:underline">
            Browse tutorials &rarr;
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
          <p className="text-muted-foreground mb-4">
            Common issues and solutions when using the Vassal.ai platform.
          </p>
          <Link href="/docs/troubleshooting" className="text-primary hover:underline">
            Get help &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}