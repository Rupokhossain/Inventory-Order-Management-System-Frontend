"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 sm:py-24">
      <Card className="border-border/80 shadow-lg text-center overflow-hidden">
        <div className="bg-destructive/10 border-b border-destructive/20 py-8 px-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg mb-3">
            <XCircle className="h-10 w-10" />
          </div>
          <Badge variant="destructive" className="text-xs px-3 py-0.5 mb-2">
            Payment Cancelled
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Order Payment Was Not Completed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
            The transaction was cancelled or interrupted. No funds were debited from your account.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-4 text-sm text-muted-foreground">
          <p>
            Your cart items have been saved. You can retry the checkout process using another payment method or contact our logistics support if you experienced gateway errors.
          </p>
        </CardContent>

        <CardFooter className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-border/60">
          <Link
            href="/cart"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Return to Cart</span>
          </Link>

          <Link
            href="/checkout"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Checkout</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
