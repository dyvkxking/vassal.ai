"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ---- Mock Integration Data ----
const SKILL_INFO = {
  id: 'skill-req-001',
  name: 'On-Chain Transaction Decoder',
  version: '2.1.0',
  category: 'infrastructure',
}

// SDK Example
const SDK_EXAMPLE = `import { VassalSDK } from '@vassal-ai/sdk';

const client = new VassalSDK({
  apiKey: process.env.VASSAL_API_KEY,
});

async function decodeTransaction() {
  const result = await client.skills.invoke('on-chain-tx-decoder', {
    chainId: 1,
    txHash: '0x1234...abcd',
    includeRevertReason: true,
  });

  console.log('Transaction status:', result.status);
  console.log('Gas used:', result.gasUsed);
  console.log('Revert reason:', result.revertReason);
}

decodeTransaction();`

const AGENT_CONFIG_EXAMPLE = `{
  "name": "my-agent",
  "version": "1.0.0",
  "skills": [
    {
      "skillId": "on-chain-tx-decoder",
      "version": "^2.0.0",
      "parameters": {
        "defaultChainId": 1
      }
    }
  ]
}`

const ERROR_HANDLING = [
  { code: 'ERR_CHAIN_UNSUPPORTED', scenario: 'Chain ID not in supported list', handling: 'Catch error and prompt user for valid chain ID (1, 137, 42161, etc.)' },
  { code: 'ERR_TX_NOT_FOUND', scenario: 'Transaction not indexed yet', handling: 'Retry with exponential backoff up to 3 attempts' },
  { code: 'ERR_RATE_LIMIT', scenario: 'Too many requests', handling: 'Implement rate limiting with 429 response handling' },
  { code: 'ERR_INVALID_SCHEMA', scenario: 'Malformed input parameters', handling: 'Validate input before calling skill' },
]

const PARAMETERS = [
  { name: 'chainId', type: 'number', required: true, defaultValue: '1', description: 'EVM chain ID (1=Ethereum, 137=Polygon, 42161=Arbitrum)' },
  { name: 'txHash', type: 'string', required: true, defaultValue: '-', description: 'Transaction hash to decode' },
  { name: 'includeRevertReason', type: 'boolean', required: false, defaultValue: 'false', description: 'Include revert reason if transaction failed' },
]

const TEST_CHECKLIST = [
  'Verify transaction decoding works on Ethereum mainnet',
  'Verify transaction decoding works on Polygon',
  'Verify error handling for unsupported chain',
  'Verify error handling for non-existent transaction',
  'Verify rate limit handling with 100+ concurrent requests',
  'Verify output schema matches expected format',
  'Verify revert reason is returned for failed transactions',
  'Verify latency is under 500ms for cached results',
]

export default function SkillIntegrationPage() {
  const params = useParams()
  const skillId = params.id as string

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href={`/skill/${skillId}`} className="hover:text-foreground">
          {SKILL_INFO.name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Integration Guide</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Integration Guide</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add this skill to your agent and handle responses correctly.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Badge variant="outline">{SKILL_INFO.category}</Badge>
          <Badge variant="outline" className="font-mono">v{SKILL_INFO.version}</Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Install the SDK</p>
              <pre className="bg-muted p-3 rounded-lg text-sm font-mono">npm install @vassal-ai/sdk</pre>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Add skill to agent config</p>
              <pre className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
                {AGENT_CONFIG_EXAMPLE}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* SDK Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>SDK Code Example</CardTitle>
            <CardDescription>Complete example for invoking this skill</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto leading-relaxed">
              {SDK_EXAMPLE}
            </pre>
          </CardContent>
        </Card>

        {/* Parameters Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>All available parameters for this skill</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PARAMETERS.map((param) => (
                  <TableRow key={param.name}>
                    <TableCell className="font-mono font-medium">{param.name}</TableCell>
                    <TableCell><Badge variant="outline">{param.type}</Badge></TableCell>
                    <TableCell>
                      {param.required ? (
                        <Badge className="bg-red-500/10 text-red-500">Required</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {param.defaultValue}
                    </TableCell>
                    <TableCell className="text-sm">{param.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Error Handling */}
        <Card>
          <CardHeader>
            <CardTitle>Error Handling</CardTitle>
            <CardDescription>Common errors and how to handle them</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Error Code</TableHead>
                  <TableHead>When It Occurs</TableHead>
                  <TableHead>Recommended Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ERROR_HANDLING.map((err) => (
                  <TableRow key={err.code}>
                    <TableCell className="font-mono text-xs">{err.code}</TableCell>
                    <TableCell className="text-sm">{err.scenario}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{err.handling}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Output Schema */}
        <Card>
          <CardHeader>
            <CardTitle>Output Schema</CardTitle>
            <CardDescription>Expected response structure</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`{
  "txHash": "string",          // Transaction hash
  "blockNumber": "number",    // Block number
  "status": "string",         // "success" | "failed" | "pending"
  "gasUsed": "number",        // Gas consumed by tx
  "revertReason": "string | null"  // Revert reason if failed
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Testing Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Checklist</CardTitle>
            <CardDescription>Verify your integration before deploying</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TEST_CHECKLIST.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded border border-muted-foreground/30 mt-0.5 shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Need help with integration?</p>
                <p className="text-sm text-muted-foreground">Reach out to the skill author or check the documentation.</p>
              </div>
              <Button variant="outline">Contact Author</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}