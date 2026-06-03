import Link from "next/link";

export default function TutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Tutorials</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Tutorials</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Step-by-step guides to help you get the most out of Vassal.ai.
      </p>

      <div className="grid gap-6">
        <Link href="/docs/tutorials/first-agent" className="p-6 border rounded-lg hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">Build Your First Agent</h2>
          <p className="text-muted-foreground">
            Create a functional AI agent from scratch. Learn about agent structure, capabilities, and deployment.
          </p>
        </Link>

        <Link href="/docs/tutorials/provider-node" className="p-6 border rounded-lg hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">Run a Provider Node</h2>
          <p className="text-muted-foreground">
            Set up and run a provider node to earn $MESH rewards by supplying compute resources to the network.
          </p>
        </Link>
      </div>
    </div>
  );
}