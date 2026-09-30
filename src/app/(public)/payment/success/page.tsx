"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Truck, FileText, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const amount = searchParams.get("amount") || "0.00";
  const method = searchParams.get("method") || "bKash Sandbox";
  const trxId = searchParams.get("trxId");

  const getMethodLabel = (m: string) => {
    if (m === "bkash") return "bKash Tokenized Sandbox";
    if (m === "card") return "Credit / Debit Card (Stripe Test)";
    if (m === "cod") return "Cash on Delivery";
    return m;
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Card className="border-border/80 shadow-lg text-center overflow-hidden">
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-8 px-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg mb-3 animate-in zoom-in-75">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-0.5 mb-2">
            Payment & Order Confirmed
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
            Your warehouse dispatch request has been recorded into the live fulfillment pipeline.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6 text-left">
          {/* Order Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-border/70 bg-muted/30 text-xs">
            <div>
              <span className="text-muted-foreground block mb-1">Order Reference ID:</span>
              <span className="font-mono font-bold text-foreground text-sm truncate block">
                {orderId}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Payment Channel:</span>
              <span className="font-semibold text-foreground text-sm block">
                {getMethodLabel(method)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Total Authorized:</span>
              <span className="font-bold text-foreground text-base block">
                ${Number(amount).toFixed(2)}
              </span>
            </div>
            {trxId && (
              <div className="sm:col-span-3 pt-2.5 mt-1 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-muted-foreground font-medium">bKash Transaction ID (TrxID):</span>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded text-xs">
                  {trxId}
                </span>
              </div>
            )}
          </div>

          {/* Fulfillment Pipeline Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Warehouse Dispatch Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Order Confirmed</p>
                  <p className="text-muted-foreground text-[11px]">Allocated in DB</p>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
                <Package className="h-4 w-4 text-primary shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Packaging & Scan</p>
                  <p className="text-muted-foreground text-[11px]">Next: Queue Bay 4</p>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-muted-foreground">Courier Dispatch</p>
                  <p className="text-muted-foreground text-[11px]">Estimated 24-48 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground py-2 px-3 rounded-md hover:bg-muted transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <span>View In Customer Orders</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
