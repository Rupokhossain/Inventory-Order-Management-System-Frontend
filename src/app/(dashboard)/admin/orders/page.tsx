/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Package,
  Calendar,
  X,
  Printer,
  ChevronDown,
  User,
  Phone,
  MapPin,
  CreditCard,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrderModal, setSelectedOrderModal] = useState<any | null>(null);

  // Fetch all orders across the platform
  const { data: response, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-all-orders"],
    queryFn: () => orderService.getAllOrders({ limit: 100 }),
  });

  const orders: any[] = response?.data || [];

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(`Order status updated to ${variables.status}!`);
      queryClient.invalidateQueries({ queryKey: ["admin-all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders-analytics"] });
      if (selectedOrderModal && selectedOrderModal.id === variables.id) {
        setSelectedOrderModal((prev: any) => ({ ...prev, status: variables.status }));
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update order status");
    },
  });

  // Filter orders by tab and search query
  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "ALL" ? true : order.status?.toUpperCase() === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === ""
        ? true
        : order.id?.toLowerCase().includes(q) ||
          order.customer?.name?.toLowerCase().includes(q) ||
          order.customer?.email?.toLowerCase().includes(q) ||
          order.customer?.contactNumber?.includes(q) ||
          order.shippingAddress?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  // KPI Calculations
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status !== "CANCELLED" ? Number(o.totalAmount || 0) : 0),
    0
  );
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const confirmedCount = orders.filter((o) => o.status === "CONFIRMED").length;
  const processingCount = orders.filter(
    (o) => o.status === "PROCESSING" || o.status === "SHIPPED"
  ).length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2.5 py-0.5">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Delivered
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 font-semibold px-2.5 py-0.5">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 font-semibold px-2.5 py-0.5">
            <Truck className="h-3 w-3 mr-1" /> Processing
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge className="bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 font-semibold px-2.5 py-0.5">
            <Truck className="h-3 w-3 mr-1" /> Shipped
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold px-2.5 py-0.5">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2.5 py-0.5">
            <AlertCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (order: any) => {
    const payment = order.payment || order.payments?.[0];
    const status = (payment?.status || order.paymentStatus || "PENDING")?.toUpperCase();
    if (status === "PAID" || status === "COMPLETED") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
          PAID
        </span>
      );
    }
    if (status === "FAILED") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 border border-rose-500/30">
          FAILED
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30">
        PENDING
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              Admin Control Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Customer Orders & Fulfillment Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Live audit of all customer purchases, shipment states, customer identities, and payment settlements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh Orders
          </Button>
          <Link
            href="/admin/reports"
            className="inline-flex items-center justify-center rounded-md text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 gap-1.5"
          >
            <span>View Financial Audit</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between gap-2 min-w-0">
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Total Orders
            </span>
            <div className="text-lg sm:text-2xl font-black text-foreground truncate">{orders.length}</div>
            <span className="text-[10px] text-muted-foreground truncate block">All volume</span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <ShoppingBag className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between gap-2 min-w-0">
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Fulfilled Revenue
            </span>
            <div className="text-lg sm:text-2xl font-black text-emerald-600 truncate">
              ${totalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-muted-foreground truncate block">Settled volume</span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <DollarSign className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between gap-2 min-w-0">
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Pending Action
            </span>
            <div className="text-lg sm:text-2xl font-black text-amber-600 truncate">{pendingCount}</div>
            <span className="text-[10px] text-muted-foreground truncate block">Awaiting review</span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between gap-2 min-w-0">
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Delivered Orders
            </span>
            <div className="text-lg sm:text-2xl font-black text-blue-600 truncate">{deliveredCount}</div>
            <span className="text-[10px] text-muted-foreground truncate block">Completed</span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Package className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        {/* Filter Tabs: 3-column grid on mobile (ALL 6 TABS ALWAYS VISIBLE, NO SCROLLING NEEDED), horizontal flex on desktop */}
        <div className="w-full sm:w-auto">
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 w-full">
            {[
              { id: "ALL", label: "All", count: orders.length },
              { id: "PENDING", label: "Pending", count: pendingCount },
              { id: "CONFIRMED", label: "Confirmed", count: confirmedCount },
              { id: "PROCESSING", label: "In Transit", count: processingCount },
              { id: "DELIVERED", label: "Delivered", count: deliveredCount },
              {
                id: "CANCELLED",
                label: "Cancelled",
                count: orders.filter((o) => o.status === "CANCELLED").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground bg-muted/30 sm:bg-transparent"
                }`}
              >
                <span className="truncate">{tab.label}</span>
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

        <div className="relative min-w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search Order ID, customer, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>
      </div>

      {/* Orders Container */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              Loading platform order stream...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-sm font-bold text-foreground">No orders matching criteria</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are no orders matching this filter condition at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* 1. MOBILE RESPONSIVE ORDER CARDS (Phone Screens) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3 bg-card hover:bg-muted/20 transition-colors">
                  {/* Card Header: Order ID + Date + Total Price & Payment Badge */}
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
                      <div className="mt-1 flex justify-end">{getPaymentBadge(order)}</div>
                    </div>
                  </div>

                  {/* Unified Customer & Product Details Box */}
                  <div className="rounded-xl border border-border/70 bg-muted/25 p-3 space-y-2.5">
                    {/* Customer Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 ring-1 ring-primary/20">
                        {order.customer?.name
                          ? order.customer.name.slice(0, 2).toUpperCase()
                          : "CU"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground text-xs truncate leading-snug">
                          {order.customer?.name || "Customer User"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate leading-snug">
                          {order.customer?.email}
                        </p>
                      </div>
                    </div>

                    {/* Ordered Items Row */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="pt-2 border-t border-border/50 text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <Package className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-bold text-primary text-xs shrink-0">
                            {order.orderItems[0].quantity}x
                          </span>
                          <span className="text-foreground font-medium text-xs truncate">
                            {order.orderItems[0].product?.name || "Product Item"}
                          </span>
                        </div>
                        {order.orderItems.length > 1 && (
                          <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 border border-border/50">
                            +{order.orderItems.length - 1} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Bar: Status Pill & Details Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Interactive Status Changer with clean label */}
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 bg-background border border-border/80 rounded-lg px-2.5 py-1.5 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                        Status:
                      </span>
                      <select
                        value={order.status}
                        disabled={updateStatusMutation.isPending}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }
                        className="w-full text-xs font-bold bg-transparent text-foreground focus:outline-none cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">IN TRANSIT</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrderModal(order)}
                      className="h-8.5 px-3 text-xs font-semibold gap-1.5 text-primary hover:bg-primary/10 border-primary/20 shrink-0 shadow-2xs rounded-lg"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. DESKTOP/TABLET TABLE VIEW (md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Order Details</th>
                    <th className="px-4 py-3 whitespace-nowrap">Customer Identity</th>
                    <th className="px-4 py-3 whitespace-nowrap">Purchased Items</th>
                    <th className="px-4 py-3 whitespace-nowrap">Total Cost</th>
                    <th className="px-4 py-3 whitespace-nowrap">Payment</th>
                    <th className="px-4 py-3 whitespace-nowrap">Fulfillment Status</th>
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
                        <span className="font-mono font-bold text-foreground text-xs block">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                            {order.customer?.name
                              ? order.customer.name.slice(0, 2).toUpperCase()
                              : "CU"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground text-xs truncate max-w-[140px]">
                              {order.customer?.name || "Customer User"}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                              {order.customer?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          {order.orderItems?.slice(0, 2).map((item: any, i: number) => (
                            <div
                              key={i}
                              className="text-foreground font-medium flex items-center gap-1.5"
                            >
                              <span className="font-bold text-primary">
                                {item.quantity}x
                              </span>
                              <span className="truncate max-w-[140px]">
                                {item.product?.name || "Product Item"}
                              </span>
                            </div>
                          ))}
                          {(order.orderItems?.length || 0) > 2 && (
                            <span className="text-[10px] text-muted-foreground italic">
                              +{order.orderItems.length - 2} more item(s)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Cost */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-black text-foreground text-sm">
                          ${Number(order.totalAmount || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                            {order.payment?.paymentMethod || order.payments?.[0]?.paymentMethod || "BKASH"}
                          </span>
                          <div>{getPaymentBadge(order)}</div>
                        </div>
                      </td>

                      {/* Status Changer Dropdown */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updateStatusMutation.isPending}
                            onChange={(e) =>
                              updateStatusMutation.mutate({
                                id: order.id,
                                status: e.target.value,
                              })
                            }
                            className="h-8 rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-semibold shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                          <div>{getStatusBadge(order.status)}</div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrderModal(order)}
                          className="h-8 gap-1.5 text-xs text-primary font-semibold hover:bg-primary/10"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Comprehensive Order & Customer Inspection Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    Order #{selectedOrderModal.id.slice(0, 10)}
                  </h3>
                  {getStatusBadge(selectedOrderModal.status)}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Placed on {new Date(selectedOrderModal.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-border/80 bg-muted/30 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <User className="h-3 w-3 text-primary" /> Customer Identity
                </span>
                <p className="font-bold text-foreground text-sm">
                  {selectedOrderModal.customer?.name || "Customer User"}
                </p>
                <p className="text-muted-foreground">
                  {selectedOrderModal.customer?.email}
                </p>
                {selectedOrderModal.customer?.contactNumber && (
                  <p className="text-muted-foreground flex items-center gap-1 pt-0.5">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {selectedOrderModal.customer.contactNumber}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-amber-500" /> Delivery Address
                </span>
                <p className="text-foreground font-medium leading-relaxed">
                  {selectedOrderModal.shippingAddress ||
                    selectedOrderModal.customer?.address ||
                    "Direct pickup / Not specified"}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-muted-foreground">Payment:</span>
                  {getPaymentBadge(selectedOrderModal)}
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground block">
                Purchased Inventory Manifest ({selectedOrderModal.orderItems?.length || 0} items)
              </span>
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {selectedOrderModal.orderItems?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between text-xs bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center font-bold text-primary shrink-0 border border-border">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {item.product?.name || "Inventory Product"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Unit Price: ${Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-foreground">
                        ${(Number(item.price || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">Total Settled Amount</span>
              <span className="font-mono text-xl font-black text-primary">
                ${Number(selectedOrderModal.totalAmount || 0).toLocaleString()}
              </span>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2 text-xs font-semibold"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Order Slip
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrderModal(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
