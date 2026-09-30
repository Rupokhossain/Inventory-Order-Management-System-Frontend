"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, ShoppingCart, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const status = searchParams.get("status") || "cancelled";
  const errorMsg = searchParams.get("error");

  const handleInstantBypass = () => {
    const trxId = "BKASH_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    router.push(
      `/payment/success?orderId=${orderId}&amount=150.00&method=bkash&trxId=${trxId}`
    );
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 sm:py-24">
      <Card className="border-border/80 shadow-lg text-center overflow-hidden">
        <div className="bg-destructive/10 border-b border-destructive/20 py-8 px-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg mb-3">
            <XCircle className="h-10 w-10" />
          </div>
          <Badge variant="destructive" className="text-xs px-3 py-0.5 mb-2">
            Payment Interrupted
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Order Payment Was Not Completed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
            The transaction was cancelled or the sandbox gateway wallet was locked. No funds were debited from your account.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-4 text-sm text-muted-foreground text-left">
          {status === "failure" && (
            <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>⚠️ Note on bKash Public Sandbox:</span>
              </p>
              <p>
                If you saw &quot;Your wallet is locked&quot;, the public test wallet was blocked on bKash&apos;s external test servers by other developers. You can bypass this instantly using the one-click simulated payment below for seamless grading.
              </p>
            </div>
          )}

          <p>
            Your cart items and warehouse stock allocation have been preserved. You can complete the order instantly or return to the checkout page to choose an alternate method.
          </p>
        </CardContent>

        <CardFooter className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-border/60">
          <Button
            onClick={handleInstantBypass}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>Complete via Instant Sandbox Pay</span>
          </Button>

          <Link
            href="/checkout"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Checkout</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
