"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  ShoppingBag,
  Package,
  Calendar,
  X,
  Printer,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ManagerOrdersPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrderModal, setSelectedOrderModal] = useState<any | null>(null);

  const { data: response, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["manager-all-orders"],
    queryFn: () => orderService.getAllOrders({ limit: 100 }),
  });

  const orders: any[] = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
    ? response
    : [];

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(`Order status updated to ${variables.status}!`);
      queryClient.invalidateQueries({ queryKey: ["manager-all-orders"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update order status");
    },
  });

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "ALL" ? true : order.status?.toUpperCase() === activeTab;
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // KPI calculations
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const confirmedCount = orders.filter((o) => o.status === "CONFIRMED").length;
  const processingCount = orders.filter((o) => o.status === "PROCESSING").length;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            Dispatch & Fulfillment Operations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Process incoming orders, transition fulfillment stages, and monitor delivery logistics.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh Pipeline
        </Button>
      </div>

      {/* KPI Cards Row (Invenza 4-Card Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Pending Verification
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-600 truncate">{pendingCount}</div>
            <span className="text-[10px] text-muted-foreground block truncate">Needs review</span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Confirmed Orders
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-600 truncate">{confirmedCount}</div>
            <span className="text-[10px] text-muted-foreground block truncate">Ready for packing</span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              In Packing / Transit
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-600 truncate">{processingCount}</div>
            <span className="text-[10px] text-muted-foreground block truncate">Courier dispatched</span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Completed Delivery
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 truncate">{deliveredCount}</div>
            <span className="text-[10px] text-muted-foreground block truncate">Successfully fulfilled</span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
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

        <div className="relative min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search Order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>
      </div>

      {/* Orders Table / Mobile Cards */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              Loading manager dispatch queue...
            </p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
            <h3 className="text-sm font-bold text-foreground">Failed to load dispatch queue</h3>
            <p className="text-xs text-rose-500 max-w-sm mx-auto font-medium">
              {(error as any)?.message || "Authentication error or unauthorized access."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2 text-xs font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Connection
            </Button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Truck className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-sm font-bold text-foreground">No orders in queue</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are no orders matching this filter condition at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (md:hidden) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3 bg-card hover:bg-muted/20 transition-colors">
                  {/* Top: Order ID + Date + Total Price & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground text-sm tracking-tight">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground/60" />
                          {new Date(order.createdAt).toLocaleDateString()}
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

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[900px]">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Order ID & Date</th>
                    <th className="px-4 py-3 whitespace-nowrap">Customer Details</th>
                    <th className="px-4 py-3 whitespace-nowrap">Ordered Items</th>
                    <th className="px-4 py-3 whitespace-nowrap">Amount</th>
                    <th className="px-4 py-3 whitespace-nowrap">Change Pipeline Status</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-foreground text-xs block">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-foreground text-xs">
                          {order.customer?.name || "Customer"}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                          {order.customer?.email}
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
                              <span className="truncate max-w-[150px]">
                                {item.product?.name || "Item"}
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

                      {/* Total */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-foreground text-sm">
                          ${Number(order.totalAmount || 0).toLocaleString()}
                        </span>
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

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-xs gap-1 font-semibold"
                          onClick={() => setSelectedOrderModal(order)}
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

      {/* Order Detail Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Order Dispatch Details
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  #{selectedOrderModal.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-lg border border-border">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Recipient Name:
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  {selectedOrderModal.customer?.name}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Contact Email:
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  {selectedOrderModal.customer?.email}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Shipping Destination:
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  {selectedOrderModal.shippingAddress || "Central Logistics Ground"}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/50 text-[10px] uppercase font-bold text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {selectedOrderModal.orderItems?.map((it: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 font-medium text-foreground">
                        {it.product?.name || "Product Item"}
                      </td>
                      <td className="px-3 py-2 text-center font-bold">{it.quantity}</td>
                      <td className="px-3 py-2 text-right font-mono">
                        ${Number(it.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Total Order Value
              </span>
              <span className="text-base font-bold font-mono text-primary">
                ${Number(selectedOrderModal.totalAmount || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="h-3.5 w-3.5" />
                Print Pack Sheet
              </Button>
              <Button
                size="sm"
                className="text-xs"
                onClick={() => setSelectedOrderModal(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
