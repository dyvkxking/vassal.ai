"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  Download,
  CalendarIcon,
  Filter,
  ExternalLink,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Users,
  Gift,
  ArrowLeftRight,
} from "lucide-react";
import { format, subDays } from "date-fns";

type TransactionType =
  | "all"
  | "stake"
  | "session_payment"
  | "rewards"
  | "token_transfer";

interface Transaction {
  id: string;
  date: string;
  type: Exclude<TransactionType, "all">;
  amount: string;
  isPositive: boolean;
  status: "completed" | "pending" | "failed";
  txHash: string;
  blockNumber: string;
  details?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-2024-1024",
    date: "2024-01-20 14:32",
    type: "stake",
    amount: "10,000 MESH",
    isPositive: true,
    status: "completed",
    txHash: "0x7f3a8c2e9b4d1f5a6c8e3b7d9f2a4c6e8b1d3f5a7c9e2b4d6f8a1c3e5b7d9f",
    blockNumber: "15,234,891",
    details: "Lock stake - Session担保",
  },
  {
    id: "TX-2024-1023",
    date: "2024-01-20 09:15",
    type: "session_payment",
    amount: "125 MESH",
    isPositive: false,
    status: "completed",
    txHash: "0x3c8a9f2d5b7e1c3f8a4d6b9e2f1a5c7d3e9b2f4a6d8c1e3b5a7f9d2c4e6b",
    blockNumber: "15,231,445",
    details: "Session payment to node_0x7a3...2e9b",
  },
  {
    id: "TX-2024-1022",
    date: "2024-01-19 18:42",
    type: "rewards",
    amount: "450 MESH",
    isPositive: true,
    status: "completed",
    txHash: "0x9e2b4c1f6d8a3f5e7c9b1d4a6f8e2c5b9a3d7f1e4c6b8d2a5f7e9c3b1d6",
    blockNumber: "15,218,772",
    details: "Staking rewards - Week 3",
  },
  {
    id: "TX-2024-1021",
    date: "2024-01-19 12:08",
    type: "token_transfer",
    amount: "5,000 MESH",
    isPositive: true,
    status: "completed",
    txHash: "0x1a5c7e8f3d9b2c6a5e8f1d4c7b9a3e6f2d8c5b7a9f1e4c3d6f8b2a5e7c9",
    blockNumber: "15,205,341",
    details: "Received from 0x4d7f...3h9k",
  },
  {
    id: "TX-2024-1020",
    date: "2024-01-18 16:55",
    type: "stake",
    amount: "3,000 MESH",
    isPositive: false,
    status: "pending",
    txHash: "0x4d7f3h9k8c2e6a1f5d9b3c7e8f4a2d6b8c1e5f7a3d9b2c6e8f1a4c5d7",
    blockNumber: "15,198,442",
    details: "Unlock request initiated",
  },
  {
    id: "TX-2024-1019",
    date: "2024-01-18 11:22",
    type: "session_payment",
    amount: "89 MESH",
    isPositive: false,
    status: "completed",
    txHash: "0x8b2e6j5l3f9c1d7a5e8f2b4c6d9e1f3a7c5b9d2e4f6a8c1d3e5b7f9a2c4",
    blockNumber: "15,192,118",
    details: "Session payment to node_0x3f9...8c2d",
  },
  {
    id: "TX-2024-1018",
    date: "2024-01-17 09:30",
    type: "rewards",
    amount: "380 MESH",
    isPositive: true,
    status: "completed",
    txHash: "0x5d8a2f6h9c4e7b1d3f8a5c9e2b6f4d7a1c9e3b5f8d2a6c4e9b7f1d5a8c3",
    blockNumber: "15,176,892",
    details: "Staking rewards - Week 3",
  },
  {
    id: "TX-2024-1017",
    date: "2024-01-16 15:44",
    type: "token_transfer",
    amount: "2,500 MESH",
    isPositive: false,
    status: "completed",
    txHash: "0x2e4a8c1f5d9b3c7e6a2f8d4c9b1e7f3a5c8d2e6b9f1a4c7d3e8f5b2a9c6d4",
    blockNumber: "15,158,445",
    details: "Sent to 0x9e2b...4c1f",
  },
  {
    id: "TX-2024-1016",
    date: "2024-01-15 08:12",
    type: "stake",
    amount: "15,000 MESH",
    isPositive: true,
    status: "completed",
    txHash: "0x7a3c5e8f2d9b4a6c8e1f3d7b9f5c2a6e8d4b1f7a9c3e5b8d2f6a4c7e9b1d3",
    blockNumber: "15,089,221",
    details: "Lock stake - Agent collateral",
  },
  {
    id: "TX-2024-1015",
    date: "2024-01-14 20:33",
    type: "session_payment",
    amount: "156 MESH",
    isPositive: false,
    status: "failed",
    txHash: "0x9f2d4b6e8a1c5f7d3b9e1c6a4f8d2c5e7b9f3a1d5c8e2f6b4d9a7c3e1b5f8",
    blockNumber: "15,072,334",
    details: "Session payment failed - insufficient balance",
  },
  {
    id: "TX-2024-1014",
    date: "2024-01-13 14:18",
    type: "rewards",
    amount: "290 MESH",
    isPositive: true,
    status: "completed",
    txHash: "0x3c6a9f2d5b8e1c4f7a9d2c6e5b8f1a4d7c2e9b6f3a5c8d1e4f7b9a3c6d2e5",
    blockNumber: "15,045,667",
    details: "Staking rewards - Week 2",
  },
  {
    id: "TX-2024-1013",
    date: "2024-01-12 10:05",
    type: "stake",
    amount: "800 MESH",
    isPositive: false,
    status: "completed",
    txHash: "0x1a5c7e8f3d9b2c6a5e8f1d4c7b9a3e6f2d8c5b7a9f1e4c3d6f8b2a5e7c9",
    blockNumber: "15,123,445",
    details: "Slash - Downtime violation",
  },
];

const TYPE_FILTERS: { value: TransactionType; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: ArrowLeftRight },
  { value: "stake", label: "Stake", icon: Coins },
  { value: "session_payment", label: "Session Payments", icon: Users },
  { value: "rewards", label: "Rewards", icon: Gift },
  { value: "token_transfer", label: "Token Transfers", icon: ArrowUpRight },
];

const DATE_RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

function getTransactionIcon(type: Transaction["type"]) {
  switch (type) {
    case "stake":
      return Coins;
    case "session_payment":
      return Users;
    case "rewards":
      return Gift;
    case "token_transfer":
      return ArrowUpRight;
    default:
      return ArrowLeftRight;
  }
}

function getTypeBadgeVariant(type: Transaction["type"]) {
  switch (type) {
    case "stake":
      return "default";
    case "session_payment":
      return "secondary";
    case "rewards":
      return "default";
    case "token_transfer":
      return "outline";
    default:
      return "secondary";
  }
}

export default function TransactionHistoryPage() {
  const [activeTab, setActiveTab] = useState<TransactionType>("all");
  const [dateRange, setDateRange] = useState<string>("30");
  const [startDate, setStartDate] = useState<Date | undefined>(
    subDays(new Date(), 30)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      // Filter by tab/type
      if (activeTab !== "all" && tx.type !== activeTab) {
        return false;
      }

      // Filter by date range
      if (dateRange !== "all") {
        const txDate = new Date(tx.date);
        const daysAgo = parseInt(dateRange);
        if (txDate < subDays(new Date(), daysAgo)) {
          return false;
        }
      }

      // Filter by custom date range
      if (startDate && new Date(tx.date) < startDate) {
        return false;
      }
      if (endDate && new Date(tx.date) > endDate) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tx.id.toLowerCase().includes(query) ||
          tx.txHash.toLowerCase().includes(query) ||
          tx.details?.toLowerCase().includes(query) ||
          tx.amount.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [activeTab, dateRange, startDate, endDate, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    const data = filteredTransactions.map((tx) => ({
      ID: tx.id,
      Date: tx.date,
      Type: tx.type,
      Amount: tx.amount,
      Status: tx.status,
      "Tx Hash": tx.txHash,
      Block: tx.blockNumber,
      Details: tx.details || "",
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, tx) => {
        const amount = parseFloat(tx.amount.replace(/,/g, "").replace(" MESH", ""));
        if (tx.isPositive) {
          acc.received += amount;
        } else {
          acc.sent += amount;
        }
        return acc;
      },
      { received: 0, sent: 0 }
    );
  }, [filteredTransactions]);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">
            View and filter all your account transactions
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search by ID, hash, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date Range Quick Select */}
            <Select value={dateRange} onValueChange={(v) => setDateRange(v ?? dateRange)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Custom Date Picker */}
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger>
                <Button variant="outline" className="w-[280px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate && endDate
                    ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`
                    : "Custom date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="outline" className="w-full justify-start">
                          {startDate ? format(startDate, "MMM d, yyyy") : "Select start"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            if (dateRange !== "all") setDateRange("all");
                          }}
                          
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="outline" className="w-full justify-start">
                          {endDate ? format(endDate, "MMM d, yyyy") : "Select end"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                            if (dateRange !== "all") setDateRange("all");
                          }}
                          
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  +{totals.received.toLocaleString()} MESH
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-green-600/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  -{totals.sent.toLocaleString()} MESH
                </p>
              </div>
              <ArrowDownRight className="w-8 h-8 text-red-600/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Change</p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    totals.received - totals.sent >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totals.received - totals.sent >= 0 ? "+" : ""}
                  {(totals.received - totals.sent).toLocaleString()} MESH
                </p>
              </div>
              <Coins className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TransactionType)}>
            <div className="px-6">
              <TabsList className="mb-4">
                {TYPE_FILTERS.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <TabsTrigger key={filter.value} value={filter.value} className="gap-2">
                      <Icon className="w-4 h-4" />
                      {filter.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tx Hash</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx) => {
                        const Icon = getTransactionIcon(tx.type);
                        return (
                          <TableRow key={tx.id}>
                            <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                            <TableCell className="text-sm whitespace-nowrap">
                              {tx.date}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getTypeBadgeVariant(tx.type)} className="gap-1">
                                <Icon className="w-3 h-3" />
                                {tx.type.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell
                              className={`text-right font-medium ${
                                tx.isPositive ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {tx.isPositive ? "+" : "-"}
                              {tx.amount}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  tx.status === "completed"
                                    ? "default"
                                    : tx.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {tx.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-sm">
                                  {tx.txHash.slice(0, 10)}...
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopy(tx.txHash, tx.id)}
                                >
                                  {copiedId === tx.id ? (
                                    <Check className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                >
                                  <a
                                    href={`https://explorer.example.com/tx/${tx.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {tx.blockNumber}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                              {tx.details}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No transactions found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
