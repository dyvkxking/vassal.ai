"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

// Mock past exports data
const pastExports = [
  {
    id: "1",
    date: "2026-06-01",
    type: "CSV",
    content: "Transactions + Sessions",
    records: 847,
    size: "128 KB",
  },
  {
    id: "2",
    date: "2026-05-15",
    type: "PDF",
    content: "Earnings Breakdown",
    records: 24,
    size: "342 KB",
  },
  {
    id: "3",
    date: "2026-05-01",
    type: "JSON",
    content: "Full Report",
    records: 1203,
    size: "256 KB",
  },
  {
    id: "4",
    date: "2026-04-15",
    type: "CSV",
    content: "Transactions",
    records: 612,
    size: "98 KB",
  },
]

const exportTypes = [
  { value: "csv", label: "CSV", description: "Spreadsheet-compatible format" },
  { value: "pdf", label: "PDF", description: "Print-ready document" },
  { value: "json", label: "JSON", description: "Structured data format" },
]

const dateRanges = [
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "last-quarter", label: "Last Quarter" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
]

const contentOptions = [
  { id: "transactions", label: "Transactions", description: "All payment transactions" },
  { id: "sessions", label: "Sessions", description: "Session data and metrics" },
  { id: "earnings", label: "Earnings Breakdown", description: "Revenue by category" },
  { id: "refunds", label: "SLA Refunds", description: "SLA refund transactions" },
]

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function ExportPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Export Earnings</h1>
        <p className="text-muted-foreground">
          Download your earnings data in various formats
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Export Type */}
          <Card>
            <CardHeader>
              <CardTitle>Export Type</CardTitle>
              <CardDescription>
                Choose the format for your export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {exportTypes.map((type) => (
                  <div
                    key={type.value}
                    className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    onClick={() => console.log("Selected:", type.value)}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {type.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle>Date Range</CardTitle>
              <CardDescription>
                Select the time period for your export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select defaultValue="this-month">
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Content Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Select what data to include in your export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <Checkbox
                    id={option.id}
                    defaultChecked={["transactions", "sessions", "earnings"].includes(option.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={option.id}
                      className="font-medium text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={() => console.log("Generating export...")}
          >
            Generate Export
          </Button>
        </div>

        {/* Past Exports */}
        <Card>
          <CardHeader>
            <CardTitle>Past Exports</CardTitle>
            <CardDescription>Your recent export history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastExports.map((export_) => (
                <div
                  key={export_.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{export_.type}</Badge>
                      <span className="text-sm font-medium">
                        {formatDate(export_.date)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {export_.size}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {export_.content}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {export_.records} records
                    </span>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}