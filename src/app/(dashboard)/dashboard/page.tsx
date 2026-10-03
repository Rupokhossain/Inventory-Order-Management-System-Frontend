"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowUpRight,
  ExternalLink,
  Eye,
  FileText,
  Printer,
  X,
  CreditCard,
  Smartphone,
  Banknote,
  Search,
  Filter,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  const handleQuickPay = async (orderId: string) => {
    try {
      setPayingOrderId(orderId);
      await paymentService.simulatePayment(orderId, "BKASH");
      toast.success("Payment authorized & settled! Order status updated to Confirmed.");
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
    } catch (err: any) {
      toast.error(err?.message || "Payment settlement failed");
    } finally {
      setPayingOrderId(null);
    }
  };

  // Fetch customer orders
  const { data, isLoading } = useQuery({
    queryKey: ["customer-orders"],
    queryFn: () => orderService.getMyOrders({ limit: 20 }),
  });

  const orders: any[] = data?.data || [];

  // Metrics Calculation
  const totalOrders = orders.length;
  const totalSpent = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const activeOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-semibold hover:bg-blue-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 text-xs font-semibold hover:bg-purple-500/20">
            <Package className="h-3 w-3 mr-1" /> Packaging
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20">
            <Truck className="h-3 w-3 mr-1" /> Delivered
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="text-xs font-semibold">
            <XCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  const getPaymentBadge = (order: any) => {
    const isPaid = order.payment?.status === "PAID";
    const method = order.payment?.paymentGateway || "Simulated";

    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-foreground flex items-center gap-1">
          {method === "BKASH" ? (
            <Smartphone className="h-3.5 w-3.5 text-pink-600" />
          ) : method === "CARD" ? (
            <CreditCard className="h-3.5 w-3.5 text-blue-600" />
          ) : (
            <Banknote className="h-3.5 w-3.5 text-emerald-600" />
          )}
          <span>{method}</span>
        </span>
        <span
          className={`text-[10px] font-semibold ${
            isPaid ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {isPaid ? "● Authorized / Paid" : "○ Pending Settlement"}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. Invenza Style Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 suppressHydrationWarning className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Welcome back, {user?.name || "Valued Customer"}!
                </h1>
                <Badge suppressHydrationWarning variant="outline" className="text-[10px] uppercase font-bold text-primary">
                  {user?.role || "CUSTOMER"}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                Here is what is happening with your warehouse orders today. You have{" "}
                <span className="font-bold text-foreground">{activeOrders} active shipment(s)</span> in the
                fulfillment pipeline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Invenza Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders Card */}
        <Card className="border-border/80 shadow-2xs relative overflow-hidden bg-card">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Live
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">
                {isLoading ? "..." : totalOrders}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Total Orders Placed</div>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-3">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: "80%" }} />
            </div>
          </CardContent>
        </Card>

        {/* Total Spend Card */}
        <Card className="border-border/80 shadow-2xs relative overflow-hidden bg-card">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Cumulative
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">
                ${isLoading ? "..." : totalSpent.toFixed(2)}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Total Capital Spent</div>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-3">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "90%" }} />
            </div>
          </CardContent>
        </Card>

        {/* Active Dispatches Card */}
        <Card className="border-border/80 shadow-2xs relative overflow-hidden bg-card">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                In Transit
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">
                {isLoading ? "..." : activeOrders}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Pending / In Dispatch</div>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-3">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "45%" }} />
            </div>
          </CardContent>
        </Card>

        {/* Fulfilled Deliveries Card */}
        <Card className="border-border/80 shadow-2xs relative overflow-hidden bg-card">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Completed
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground">
                {isLoading ? "..." : completedOrders}
              </div>
              <div className="text-xs font-medium text-muted-foreground">Successfully Delivered</div>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-3">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: "65%" }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Recent Orders & Tracking Table */}
      <Card className="border-border/80 shadow-xs overflow-hidden bg-card">
        <CardHeader className="p-5 sm:p-6 border-b border-border/60 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Recent Orders & Fulfillment Pipeline</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Real-time synchronization with warehouse allocation and carrier delivery status.
            </CardDescription>
          </div>

          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">
              Loading warehouse order logs...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">No Orders Found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                You haven&apos;t placed any orders yet. Visit our inventory catalog to browse and allocate supplies.
              </p>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Browse Products</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Order ID</th>
                    <th className="py-3 px-4">Date Placed</th>
                    <th className="py-3 px-4">Items / Supplies</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.slice(0, 8).map((order) => {
                    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-foreground">
                          {order.id.slice(0, 8)}...
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">{formattedDate}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground">
                              {order.orderItems?.length || 1} item(s)
                            </span>
                            <span className="text-muted-foreground">
                              (
                              {order.orderItems?.[0]?.product?.name ||
                                order.orderItems?.[0]?.productName ||
                                "Item"}
                              )
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          ${Number(order.totalAmount).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">{getPaymentBadge(order)}</td>
                        <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status === "PENDING" && order.payment?.status !== "PAID" && (
                              <Button
                                size="sm"
                                disabled={payingOrderId === order.id}
                                onClick={() => handleQuickPay(order.id)}
                                className="h-7 px-2.5 text-[11px] font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                                title="Authorize and settle payment for this order"
                              >
                                <Zap className="h-3 w-3" />
                                <span>{payingOrderId === order.id ? "Settling..." : "Pay Now"}</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="h-8 text-xs font-semibold gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Invoice</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Invenza Style Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl border-border/80 shadow-2xl bg-card overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="p-6 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] mb-1">
                  OFFICIAL INVOICE RECEIPT
                </Badge>
                <CardTitle className="text-lg font-bold text-foreground">
                  Order #{selectedOrder.id}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-6 space-y-6 text-xs">
              {/* Order Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Customer:</span>
                  <span className="font-bold text-foreground block truncate">
                    {user?.name || "Customer"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Fulfillment Status:</span>
                  <span className="mt-0.5 block">{getStatusBadge(selectedOrder.status)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Payment Gateway:</span>
                  <span className="font-bold text-foreground block">
                    {selectedOrder.payment?.paymentGateway || "Simulated"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">TrxID:</span>
                  <span className="font-mono text-emerald-600 font-bold block truncate">
                    {selectedOrder.payment?.transactionId || "N/A"}
                  </span>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div>
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">
                  Purchased Items & Allocations
                </h4>
                <div className="rounded-lg border border-border/60 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border/60">
                      <tr>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3 text-center">Quantity</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {selectedOrder.orderItems?.map((item: any) => {
                        const unitPrice = Number(item.unitPrice || item.price || 0);
                        const sub = unitPrice * item.quantity;
                        return (
                          <tr key={item.id}>
                            <td className="py-2.5 px-3 font-semibold text-foreground">
                              {item.product?.name || item.productName || "Product"}
                            </td>
                            <td className="py-2.5 px-3 text-center text-muted-foreground">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-right text-muted-foreground">
                              ${unitPrice.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-foreground">
                              ${sub.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border/60">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Warehouse Dispatch:</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-border/60 pt-1.5 flex justify-between font-extrabold text-foreground text-sm">
                    <span>Total Authorized:</span>
                    <span>${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="p-4 sm:p-6 pt-0 border-t border-border/60 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2 text-xs font-semibold"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Invoice</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-semibold"
              >
                Close Receipt
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
