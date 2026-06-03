"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "How does the SLA slashing mechanism work?",
    answer: "SLA slashing is a penalty system that removes a portion of a provider's staked $MESH when they fail to meet agreed-upon service levels. If a session times out, crashes, or returns errors, the provider's SLA score decreases. Below certain thresholds, automatic slashing occurs - typically 1-5% of the stake per incident. Providers with consistently high SLA scores (95%+) earn priority matching and bonus rewards.",
  },
  {
    question: "How do I become a compute provider?",
    answer: "To become a provider, you need to: (1) Install the vassal-provider software on a compatible machine with 4+ cores and 8GB+ RAM, (2) Initialize your node with 'vassal-provider init', (3) Configure your node settings like max concurrent sessions and GPU support, (4) Stake at least 1000 $MESH tokens, and (5) Start your node with 'vassal-provider start'. Your node will then begin receiving sessions that match your capabilities.",
  },
  {
    question: "How do agents learn from sessions?",
    answer: "Agents can be designed to learn from session data through several mechanisms. Short-term learning happens within a session via context windows - agents remember previous messages to maintain coherent conversations. Long-term learning requires explicit feedback loops: agent responses can be rated, corrections can be stored in external memory systems, and weights can be adjusted in custom model fine-tunes. The Vassal.ai network also aggregates anonymized session patterns to help improve agent capabilities over time.",
  },
  {
    question: "What is the $MESH token used for?",
    answer: "$MESH is the utility token powering the Vassal.ai ecosystem. It serves three primary purposes: (1) Staking - providers stake $MESH to secure their nodes and earn the right to serve sessions, with stake subject to slashing for poor performance; (2) Governance - token holders can vote on protocol upgrades, parameter changes, and ecosystem proposals; (3) Payments - developers pay $MESH to deploy agents and use the network, with providers receiving rewards in $MESH for completed sessions.",
  },
  {
    question: "How are provider rewards calculated?",
    answer: "Provider rewards are calculated based on three factors: base session reward (set per capability), a multiplier based on your SLA score (ranging from 0.5x for low scores to 1.5x for scores above 99%), and a network bonus for operating during high-demand periods. Rewards are distributed at the end of each session after successful completion. Example: a session with a 100 $MESH base reward, 98% SLA score (1.2x multiplier), and 1.1x network bonus = 100 * 1.2 * 1.1 = 132 $MESH.",
  },
  {
    question: "Can I run multiple agent sessions simultaneously?",
    answer: "Yes, provider nodes can run multiple sessions concurrently. When configuring your node, you set a 'max-sessions' parameter (default: 5) that controls how many simultaneous sessions your node will accept. Each session runs in an isolated environment to prevent interference. The number of concurrent sessions you can handle depends on your hardware - more CPU cores and RAM allow higher concurrency. GPU-enabled nodes have separate capacity limits for GPU-accelerated workloads.",
  },
  {
    question: "What happens if an agent goes offline during a session?",
    answer: "If an agent disconnects mid-session due to provider issues, the network automatically initiates a recovery process. The session is placed in a 'pending' state while the system attempts to match it with an alternative provider that has the same agent capabilities. If recovery succeeds within 60 seconds, the session continues seamlessly. If not, the session fails and the provider who dropped the agent receives an SLA penalty. The user receives a refund for failed sessions.",
  },
  {
    question: "How do I list my agent on the marketplace?",
    answer: "To list an agent on the marketplace: (1) Ensure your agent is deployed and running successfully on the network, (2) Navigate to the Marketplace section in the Vassal.ai dashboard, (3) Click 'List Agent' and select your agent from the dropdown, (4) Set your pricing (per-session or monthly subscription in $MESH), (5) Write a description and add metadata like category and tags, (6) Submit for review. Approved agents appear in the marketplace within 24-48 hours.",
  },
  {
    question: "What is the Genesis Program?",
    answer: "The Genesis Program is an early adopter initiative that rewards foundational participants in the Vassal.ai network. Members receive bonus $MESH rewards (typically 25-50% extra APY on provider earnings), increased governance voting power (1.5x weight on votes), and access to exclusive features and beta capabilities. The program is limited to early contributors who staked and operated nodes during the first 6 months after launch.",
  },
  {
    question: "How do I delegate my governance votes?",
    answer: "You can delegate your governance voting power to another address without transferring your $MESH tokens. To delegate, go to the Governance section in the Vassal.ai dashboard, select 'Delegation', choose the address you want to delegate to, and confirm the transaction. Your delegate can vote on your behalf on proposals. You can change your delegate at any time. Delegation is useful if you lack the time to actively participate in governance or want to consolidate voting power with experienced community members.",
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b">
      <button
        onClick={onClick}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-lg">{question}</span>
        <span
          className={`ml-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">
          <a href="/" className="hover:underline">Home</a> / FAQ
        </nav>
      </div>
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Find answers to common questions about the Vassal.ai platform.
      </p>

      <div className="space-y-2">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground mb-4">
          Cannot find the answer you are looking for? Reach out to our support team.
        </p>
        <a
          href="/docs/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}