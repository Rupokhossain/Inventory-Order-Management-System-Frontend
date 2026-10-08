"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
  Search,
  Receipt,
  Download,
  ShoppingBag,
  ExternalLink,
  Calendar,
  CreditCard,
  X,
  Printer,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CustomerOrdersPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  const handleQuickPay = async (orderId: string) => {
    try {
      setPayingOrderId(orderId);
      await paymentService.simulatePayment(orderId, "BKASH");
      toast.success("Payment authorized & settled! Order status updated to CONFIRMED.");
      queryClient.invalidateQueries({ queryKey: ["my-orders-full"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
    } catch (err: any) {
      toast.error(err?.message || "Payment settlement failed");
    } finally {
      setPayingOrderId(null);
    }
  };

  const { data: response, isLoading } = useQuery({
    queryKey: ["my-orders-full"],
    queryFn: () => orderService.getMyOrders(),
  });

  const orders: any[] = response?.data || [];

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "ALL" ? true : order.status?.toUpperCase() === activeTab;
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.orderItems?.some((item: any) =>
            item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2.5 py-0.5">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Delivered
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 font-semibold px-2.5 py-0.5">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Confirmed
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 font-semibold px-2.5 py-0.5">
            <Truck className="h-3.5 w-3.5 mr-1" /> Processing
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold px-2.5 py-0.5">
            <Clock className="h-3.5 w-3.5 mr-1" /> Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2.5 py-0.5">
            <AlertCircle className="h-3.5 w-3.5 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
            PAID
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/15 text-rose-600 border border-rose-500/30">
            FAILED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">
            UNPAID
          </span>
        );
    }
  };

  const tabs = [
    { id: "ALL", label: "All Orders", count: orders.length },
    {
      id: "PENDING",
      label: "Pending",
      count: orders.filter((o) => o.status === "PENDING").length,
    },
    {
      id: "CONFIRMED",
      label: "Confirmed",
      count: orders.filter((o) => o.status === "CONFIRMED").length,
    },
    {
      id: "PROCESSING",
      label: "In Transit",
      count: orders.filter((o) => o.status === "PROCESSING").length,
    },
    {
      id: "DELIVERED",
      label: "Delivered",
      count: orders.filter((o) => o.status === "DELIVERED").length,
    },
    {
      id: "CANCELLED",
      label: "Cancelled",
      count: orders.filter((o) => o.status === "CANCELLED").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
            <ShoppingBag className="h-6 w-6 text-primary" />
            My Order Dispatches
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track status, download invoices, and manage deliveries in real-time.
          </p>
        </div>
        <Link href="/products">
          <Button size="sm" className="gap-2 shadow-xs text-xs font-semibold">
            <Package className="h-4 w-4" />
            Browse New Products
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        {/* Filter Tabs: 3-column grid on mobile (ALL 6 TABS ALWAYS VISIBLE, NO SCROLLING NEEDED), horizontal flex on desktop */}
        <div className="w-full md:w-auto">
          <div className="grid grid-cols-3 md:flex md:items-center gap-1.5 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 md:px-3 py-2 md:py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center md:justify-start gap-1 md:gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground bg-muted/30 md:bg-transparent"
                }`}
              >
                <span className="truncate">{tab.id === "ALL" ? "All" : tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              Retrieving live dispatch records...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No orders found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? "No orders match your search criteria. Try a different keyword."
                  : "You do not have any orders in this category."}
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm" className="text-xs mt-2">
                Explore Warehouse Stock
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (md:hidden) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3 bg-card hover:bg-muted/20 transition-colors">
                  {/* Top Bar: Order ID + Date + Total Price & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground text-sm tracking-tight">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground/60" />
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-black text-foreground text-base block leading-tight">
                        ${Number(order.totalAmount || 0).toLocaleString()}
                      </span>
                      <div className="mt-1 flex justify-end">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>

                  {/* Unified Items & Payment Box */}
                  <div className="rounded-xl border border-border/70 bg-muted/25 p-3 space-y-2">
                    {/* Items */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="space-y-1.5">
                        {order.orderItems.slice(0, 2).map((item: any, i: number) => (
                          <div
                            key={i}
                            className="text-foreground font-medium flex items-center gap-2 text-xs"
                          >
                            <Package className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="font-bold text-primary text-xs shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="truncate text-foreground font-medium">
                              {item.product?.name || "Product Item"}
                            </span>
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <span className="text-[10px] text-muted-foreground italic block pl-5">
                            +{order.orderItems.length - 2} more item(s)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Payment Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Payment:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground uppercase text-[10px]">
                          {order.payment?.paymentMethod || "BKASH"}
                        </span>
                        {getPaymentStatusBadge(order.payment?.status)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {order.status === "PENDING" && order.payment?.status !== "PAID" && (
                      <Button
                        size="sm"
                        disabled={payingOrderId === order.id}
                        onClick={() => handleQuickPay(order.id)}
                        className="h-8.5 px-3 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer flex-1 rounded-lg"
                        title="Pay & settle this pending order"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>{payingOrderId === order.id ? "Settling..." : "Pay Now"}</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8.5 px-3 text-xs gap-1.5 bg-background shadow-2xs hover:bg-primary hover:text-primary-foreground transition-all flex-1 rounded-lg"
                      onClick={() => setSelectedInvoiceOrder(order)}
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      <span>Invoice Receipt</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Order ID & Date</th>
                    <th className="px-4 py-3 whitespace-nowrap">Items Ordered</th>
                    <th className="px-4 py-3 whitespace-nowrap">Payment</th>
                    <th className="px-4 py-3 whitespace-nowrap">Fulfillment Status</th>
                    <th className="px-4 py-3 whitespace-nowrap">Total Amount</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Order ID & Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-foreground">
                          #{order.id.slice(0, 8)}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" />
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          {order.orderItems?.slice(0, 2).map((item: any, i: number) => (
                            <div
                              key={i}
                              className="text-foreground font-medium flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <span className="font-bold text-primary">
                                {item.quantity}x
                              </span>
                              <span className="truncate max-w-[180px]">
                                {item.product?.name || "Product Item"}
                              </span>
                            </div>
                          ))}
                          {(order.orderItems?.length || 0) > 2 && (
                            <span className="text-[10px] text-muted-foreground italic whitespace-nowrap">
                              +{order.orderItems.length - 2} more item(s)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payment Info */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                            {order.payment?.paymentMethod || "BKASH"}
                          </span>
                          <div>{getPaymentStatusBadge(order.payment?.status)}</div>
                        </div>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">{getStatusBadge(order.status)}</td>

                      {/* Total Amount */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-foreground text-sm font-mono">
                          ${Number(order.totalAmount || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === "PENDING" && order.payment?.status !== "PAID" && (
                            <Button
                              size="sm"
                              disabled={payingOrderId === order.id}
                              onClick={() => handleQuickPay(order.id)}
                              className="h-8 px-2.5 text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                              title="Pay & settle this pending order"
                            >
                              <Zap className="h-3 w-3" />
                              <span>{payingOrderId === order.id ? "Settling..." : "Pay Now"}</span>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs gap-1.5 bg-background shadow-2xs hover:bg-primary hover:text-primary-foreground transition-all"
                            onClick={() => setSelectedInvoiceOrder(order)}
                          >
                            <Receipt className="h-3.5 w-3.5" />
                            <span>Invoice</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-xs">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Tax Invoice & Dispatch Receipt
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    ID: #{selectedInvoiceOrder.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Invoice Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/70 text-xs">
              <div>
                <p className="text-muted-foreground uppercase text-[10px] font-bold">
                  Order Date
                </p>
                <p className="font-semibold text-foreground mt-0.5">
                  {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase text-[10px] font-bold">
                  Payment Method
                </p>
                <p className="font-semibold text-foreground mt-0.5 uppercase">
                  {selectedInvoiceOrder.payment?.paymentMethod || "bKash"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase text-[10px] font-bold">
                  Payment Status
                </p>
                <div className="mt-0.5">
                  {getPaymentStatusBadge(selectedInvoiceOrder.payment?.status)}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground uppercase text-[10px] font-bold">
                  Delivery Status
                </p>
                <div className="mt-0.5">
                  {getStatusBadge(selectedInvoiceOrder.status)}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="text-xs p-3 rounded-lg border border-border/60 bg-background">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">
                Shipping Destination:
              </p>
              <p className="font-medium text-foreground mt-0.5">
                {selectedInvoiceOrder.shippingAddress || "Standard Ground Dispatch"}
              </p>
            </div>

            {/* Line Items Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                  <tr>
                    <th className="px-3.5 py-2">Item Description</th>
                    <th className="px-3.5 py-2 text-center">Qty</th>
                    <th className="px-3.5 py-2 text-right">Unit Price</th>
                    <th className="px-3.5 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {selectedInvoiceOrder.orderItems?.map((item: any, idx: number) => {
                    const price = Number(item.price || 0);
                    const qty = Number(item.quantity || 1);
                    return (
                      <tr key={idx}>
                        <td className="px-3.5 py-2.5 font-medium text-foreground">
                          {item.product?.name || "Product SKU Item"}
                        </td>
                        <td className="px-3.5 py-2.5 text-center">{qty}</td>
                        <td className="px-3.5 py-2.5 text-right font-mono">
                          ${price.toFixed(2)}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-bold">
                          ${(price * qty).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Invoice Total */}
            <div className="flex justify-end">
              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono">
                    ${Number(selectedInvoiceOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping & Logistics</span>
                  <span className="font-mono text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-primary">
                    ${Number(selectedInvoiceOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
                onClick={() => window.print()}
              >
                <Printer className="h-3.5 w-3.5" />
                Print Invoice
              </Button>
              <Button
                size="sm"
                className="text-xs"
                onClick={() => setSelectedInvoiceOrder(null)}
              >
                Close Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
