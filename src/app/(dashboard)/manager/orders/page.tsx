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

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["manager-all-orders"],
    queryFn: () => orderService.getAllOrders({ limit: 100 }),
  });

  const orders: any[] = response?.data || [];

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
          className="gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Pipeline
        </Button>
      </div>

      {/* KPI Cards Row (Invenza 4-Card Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Verification
            </span>
            <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
            <span className="text-[10px] text-muted-foreground">Needs review</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Confirmed Orders
            </span>
            <div className="text-2xl font-black text-blue-600">{confirmedCount}</div>
            <span className="text-[10px] text-muted-foreground">Ready for packing</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              In Packing / Transit
            </span>
            <div className="text-2xl font-black text-purple-600">{processingCount}</div>
            <span className="text-[10px] text-muted-foreground">Courier dispatched</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <Truck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Completed Delivery
            </span>
            <div className="text-2xl font-black text-emerald-600">{deliveredCount}</div>
            <span className="text-[10px] text-muted-foreground">Successfully fulfilled</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Package className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Dispatches", count: orders.length },
            { id: "PENDING", label: "Pending", count: pendingCount },
            { id: "CONFIRMED", label: "Confirmed", count: confirmedCount },
            { id: "PROCESSING", label: "Processing", count: processingCount },
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
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

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              Loading manager dispatch queue...
            </p>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                <tr>
                  <th className="px-4 py-3">Order ID & Date</th>
                  <th className="px-4 py-3">Customer Details</th>
                  <th className="px-4 py-3">Ordered Items</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Change Pipeline Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-foreground text-xs block">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
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
                            className="text-foreground font-medium flex items-center gap-1.5"
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
                          <span className="text-[10px] text-muted-foreground italic">
                            +{order.orderItems.length - 2} more item(s)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-foreground text-sm">
                        ${Number(order.totalAmount || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Status Changer Dropdown */}
                    <td className="px-4 py-3.5">
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
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
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
