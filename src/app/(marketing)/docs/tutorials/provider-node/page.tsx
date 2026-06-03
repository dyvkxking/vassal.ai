export default function ProviderNodeTutorialPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">Documentation / Tutorials / Run a Provider Node</nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Run a Provider Node</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn how to set up a provider node and earn $MESH rewards by supplying compute resources.
      </p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">What is a Provider Node?</h2>
        <p className="mb-4">
          Provider nodes are compute resources that run agent sessions on the Vassal.ai network. Providers earn $MESH token rewards based on the number of successful sessions they complete and their SLA score.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Requirements</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>4+ CPU cores, 8GB+ RAM</li>
          <li>Ubuntu 20.04+ or macOS 12+</li>
          <li>Stable internet connection</li>
          <li>Minimum 1000 $MESH tokens for stake</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Step 1: Install the Provider Software</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`curl -L https://install.vassal.ai | sh
vassal-provider init`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Step 2: Configure Your Node</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`vassal-provider configure --name "My Node"
vassal-provider configure --gpu enabled
vassal-provider configure --max-sessions 10`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Step 3: Stake $MESH Tokens</h2>
        <p className="mb-4">Stake tokens to secure your node and start receiving sessions:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`vassal-provider stake --amount 1000`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Step 4: Start Your Node</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`vassal-provider start`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Monitoring Rewards</h2>
        <p className="mb-4">Check your node status and earnings:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{`vassal-provider status
vassal-provider rewards --history`}</code>
        </pre>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-8">
          <p className="text-sm">
            <strong>Tip:</strong> Maintain a high SLA score by keeping your node online and responsive. Nodes with scores above 95% receive priority in the matching algorithm.
          </p>
        </div>
      </div>
    </div>
  );
}