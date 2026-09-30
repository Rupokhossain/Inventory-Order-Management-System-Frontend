"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { paymentService, PaymentItem } from "@/services/payment.service";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Copy,
  Check,
  ShieldCheck,
  Receipt,
  ArrowUpRight,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CustomerPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => paymentService.getMyPayments(),
  });

  const payments: PaymentItem[] = response?.data || [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPayments = payments.filter((item) => {
    const matchesFilter =
      filterStatus === "ALL" ? true : item.status?.toUpperCase() === filterStatus;
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : item.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.transactionId &&
            item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Calculate summary metrics
  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const paidCount = payments.filter((p) => p.status === "PAID").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Transaction & Payment Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit trial, bKash PGW settlements, and digital payment verification.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Ledger
        </Button>
      </div>

      {/* KPI Cards Row (Invenza 3-Card Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Settled */}
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Settled Volume
            </span>
            <div className="text-2xl font-black text-foreground">
              ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Secure Gateway Verified
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        {/* Successful Transactions */}
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cleared Transactions
            </span>
            <div className="text-2xl font-black text-foreground">
              {paidCount} Settled
            </div>
            <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> 100% Reconciliation
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Attempts */}
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending / Unverified
            </span>
            <div className="text-2xl font-black text-foreground">
              {pendingCount} Pending
            </div>
            <span className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Awaiting callback
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Records" },
            { id: "PAID", label: "Paid" },
            { id: "PENDING", label: "Pending" },
            { id: "FAILED", label: "Failed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search TrxID or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              Loading payment ledger transactions...
            </p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No payments found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No payment transactions match your current query or category filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                <tr>
                  <th className="px-4 py-3">Transaction ID (TrxID)</th>
                  <th className="px-4 py-3">Order Ref</th>
                  <th className="px-4 py-3">Gateway</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPayments.map((payment) => {
                  const trxId =
                    payment.transactionId ||
                    `TRX-${payment.id.slice(0, 10).toUpperCase()}`;
                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* TrxID with copy */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                          <span>{trxId}</span>
                          <button
                            onClick={() => copyToClipboard(trxId)}
                            title="Copy Transaction ID"
                            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                          >
                            {copiedId === trxId ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Payment #{payment.id.slice(0, 8)}
                        </span>
                      </td>

                      {/* Order Ref */}
                      <td className="px-4 py-3.5">
                        <Link
                          href="/dashboard/orders"
                          className="font-mono font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          #{payment.orderId.slice(0, 8)}
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>

                      {/* Gateway */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-600 border border-pink-500/20">
                          {payment.paymentGateway || "bKash Sandbox"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-foreground text-sm font-mono">
                          ${Number(payment.amount || 0).toFixed(2)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {payment.status === "PAID" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2 py-0.5">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Settled
                          </Badge>
                        ) : payment.status === "FAILED" ? (
                          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2 py-0.5">
                            <AlertCircle className="h-3 w-3 mr-1" /> Failed
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold px-2 py-0.5">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-muted-foreground text-[11px]">
                        {new Date(payment.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
