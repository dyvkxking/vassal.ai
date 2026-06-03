import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_EARNINGS_BREAKDOWN } from "@/lib/mock-data"

function ASCIIBarChart({ label, value, maxValue, width = 40 }: { label: string; value: number; maxValue: number; width?: number }) {
  const barLength = Math.round((value / maxValue) * width)
  const bar = "=".repeat(barLength)
  const displayValue = `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return (
    <div className="flex items-center gap-4">
      <span className="w-32 text-sm">{label}</span>
      <span className="text-primary">[{bar}]</span>
      <span className="font-mono text-sm">{displayValue}</span>
    </div>
  )
}

export default function RevenueBreakdownPage() {
  const { baseEarnings, slaComplianceBonus, genesisProgramBonus, skillInvocationEarnings } = MOCK_EARNINGS_BREAKDOWN
  const total = baseEarnings + slaComplianceBonus + genesisProgramBonus + skillInvocationEarnings
  const maxValue = baseEarnings // Use base earnings as max for scaling

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Revenue Breakdown</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Distribution (MTD)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 font-mono text-sm">
            <ASCIIBarChart label="Base Earnings" value={baseEarnings} maxValue={maxValue} />
            <ASCIIBarChart label="SLA Bonus" value={slaComplianceBonus} maxValue={maxValue} />
            <ASCIIBarChart label="Genesis Bonus" value={genesisProgramBonus} maxValue={maxValue} />
            <ASCIIBarChart label="Skill Invoke" value={skillInvocationEarnings} maxValue={maxValue} />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Percentage Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Earnings</span>
              <span>{((baseEarnings / total) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SLA Compliance Bonus</span>
              <span>{((slaComplianceBonus / total) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Genesis Program Bonus</span>
              <span>{((genesisProgramBonus / total) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Skill Invocation Earnings</span>
              <span>{((skillInvocationEarnings / total) * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sessions</span>
              <span>847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg per Session</span>
              <span>${(total / 847).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SLA Compliance Rate</span>
              <span>98.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Genesis Tier</span>
              <span>Gold</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}