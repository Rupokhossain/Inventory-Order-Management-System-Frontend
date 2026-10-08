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
  ArrowLeft,
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

  const rawData: any = response?.data;
  const payments: PaymentItem[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(response)
    ? (response as any)
    : [];

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
          <div className="flex items-center gap-3 mb-2.5">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2.5 py-1 rounded-lg border border-border/60 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
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
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Total Settled Volume
            </span>
            <div className="text-xl sm:text-2xl font-black text-foreground truncate">
              ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 truncate">
              <ShieldCheck className="h-3 w-3 shrink-0" /> Secure Gateway Verified
            </span>
          </div>
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        {/* Successful Transactions */}
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Cleared Transactions
            </span>
            <div className="text-xl sm:text-2xl font-black text-foreground truncate">
              {paidCount} Settled
            </div>
            <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1 truncate">
              <CheckCircle2 className="h-3 w-3 shrink-0" /> 100% Reconciliation
            </span>
          </div>
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Attempts */}
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Pending / Unverified
            </span>
            <div className="text-xl sm:text-2xl font-black text-foreground truncate">
              {pendingCount} Pending
            </div>
            <span className="text-[11px] font-medium text-amber-600 flex items-center gap-1 truncate">
              <Clock className="h-3 w-3 shrink-0" /> Awaiting callback
            </span>
          </div>
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterStatus === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
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

      {/* Ledger Table / Mobile Cards */}
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
          <>
            {/* Mobile Cards View (md:hidden) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredPayments.map((payment) => {
                const trxId =
                  payment.transactionId ||
                  `TRX-${payment.id.slice(0, 10).toUpperCase()}`;

                return (
                  <div key={payment.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                          <span className="truncate">{trxId}</span>
                          <button
                            onClick={() => copyToClipboard(trxId)}
                            title="Copy Transaction ID"
                            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors shrink-0"
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
                      </div>
                      <div className="shrink-0">
                        {payment.status === "PAID" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2 py-0.5 text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Settled
                          </Badge>
                        ) : payment.status === "FAILED" ? (
                          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2 py-0.5 text-[10px]">
                            <AlertCircle className="h-3 w-3 mr-1" /> Failed
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold px-2 py-0.5 text-[10px]">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Amount</span>
                        <span className="font-bold text-foreground text-sm font-mono">
                          ${Number(payment.amount || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Gateway</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-600 border border-pink-500/20">
                          {payment.paymentGateway || "bKash Sandbox"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-border/40">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Order Ref</span>
                        <Link
                          href="/dashboard/orders"
                          className="font-mono font-medium text-primary hover:underline flex items-center gap-1 text-xs"
                        >
                          #{payment.orderId.slice(0, 8)}
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    <div className="text-[10px] text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Transaction ID (TrxID)</th>
                    <th className="px-4 py-3 whitespace-nowrap">Order Ref</th>
                    <th className="px-4 py-3 whitespace-nowrap">Gateway</th>
                    <th className="px-4 py-3 whitespace-nowrap">Amount</th>
                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 whitespace-nowrap">Timestamp</th>
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
                        <td className="px-4 py-3.5 whitespace-nowrap">
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
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <Link
                            href="/dashboard/orders"
                            className="font-mono font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            #{payment.orderId.slice(0, 8)}
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </td>

                        {/* Gateway */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-600 border border-pink-500/20">
                            {payment.paymentGateway || "bKash Sandbox"}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-foreground text-sm font-mono">
                            ${Number(payment.amount || 0).toFixed(2)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
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
                        <td className="px-4 py-3.5 text-muted-foreground text-[11px] whitespace-nowrap">
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
          </>
        )}
      </div>
    </div>
  );
}
