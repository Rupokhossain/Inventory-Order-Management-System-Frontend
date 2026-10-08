/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Send,
  User,
  Check,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { inquiryService, InquiryItem } from "@/services/inquiry.service";

interface InquiriesManagerProps {
  role: "ADMIN" | "MANAGER";
}

export function InquiriesManager({ role }: InquiriesManagerProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  const { data: response, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["inquiries-list", activeTab, searchQuery],
    queryFn: () =>
      inquiryService.getAllInquiries({
        status: activeTab === "ALL" ? undefined : activeTab,
        searchTerm: searchQuery.trim() || undefined,
      }),
  });

  const inquiries: InquiryItem[] = response?.data || [];
  const meta = response?.meta || { total: inquiries.length, unreadCount: 0 };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "UNREAD" | "READ" | "RESOLVED" }) =>
      inquiryService.updateStatus(id, status),
    onSuccess: (updated) => {
      toast.success("Inquiry status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["inquiries-list"] });
      if (selectedInquiry && selectedInquiry.id === updated.id) {
        setSelectedInquiry(updated);
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inquiryService.deleteInquiry(id),
    onSuccess: () => {
      toast.success("Inquiry deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["inquiries-list"] });
      if (selectedInquiry) setSelectedInquiry(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete inquiry");
    },
  });

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UNREAD":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30 text-[10px] font-bold">
            UNREAD
          </Badge>
        );
      case "READ":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/30 text-[10px] font-bold">
            READ
          </Badge>
        );
      case "RESOLVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-[10px] font-bold">
            RESOLVED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openInquiry = (inquiry: InquiryItem) => {
    setSelectedInquiry(inquiry);
    if (inquiry.status === "UNREAD") {
      updateStatusMutation.mutate({ id: inquiry.id, status: "READ" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>CUSTOMER SUPPORT & DISPATCH INQUIRIES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Customer Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor and resolve inbound inquiries submitted via the Public Contact Desk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-semibold">Total Inquiries</span>
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground">{meta.total || inquiries.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-semibold">Unread</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {meta.unreadCount ?? inquiries.filter((i) => i.status === "UNREAD").length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-semibold">In Review</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600">
            {inquiries.filter((i) => i.status === "READ").length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-semibold">Resolved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {inquiries.filter((i) => i.status === "RESOLVED").length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/80 shadow-xs">
        {/* Status Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 w-full sm:w-auto">
          {[
            { label: "All Tickets", value: "ALL" },
            { label: "Unread", value: "UNREAD" },
            { label: "Read", value: "READ" },
            { label: "Resolved", value: "RESOLVED" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.value)}
              className="text-xs w-full sm:w-auto font-medium"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search sender, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9 bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Inquiries List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Loading customer inquiries...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-dashed border-border/80 space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <MessageSquare className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No Inquiries Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No inquiry matched "${searchQuery}". Try a different keyword.`
                : "There are currently no customer inquiries in this category."}
            </p>
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-xs"
            >
              Clear Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="divide-y divide-border/60">
            {inquiries.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-muted/30 ${
                  item.status === "UNREAD" ? "bg-amber-500/5" : ""
                }`}
              >
                {/* Inquiry Preview */}
                <div
                  onClick={() => openInquiry(item)}
                  className="space-y-2 cursor-pointer flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(item.status)}
                    <span className="text-xs font-bold text-foreground hover:text-primary transition-colors">
                      {item.subject || "General Inquiry"}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <User className="h-3 w-3 text-primary" />
                      {item.name}
                    </span>
                    <a
                      href={`mailto:${item.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-primary flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3 text-blue-500" />
                      {item.email}
                    </a>
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-primary flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3 text-emerald-500" />
                        {item.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInquiry(item)}
                    className="text-xs gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Ticket</span>
                  </Button>

                  {item.status !== "RESOLVED" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: item.id, status: "RESOLVED" })
                      }
                      disabled={updateStatusMutation.isPending}
                      className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Resolve</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: item.id, status: "UNREAD" })
                      }
                      disabled={updateStatusMutation.isPending}
                      className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    >
                      Mark Unread
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this customer inquiry?")) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-xs text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="bg-card w-full max-w-xl rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Inquiry Details</h3>
                  <p className="text-[10px] text-muted-foreground">
                    Ticket ID: {selectedInquiry.id}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedInquiry(null)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedInquiry.status)}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(selectedInquiry.created_at)}
                  </span>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant={selectedInquiry.status === "UNREAD" ? "default" : "outline"}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedInquiry.id,
                        status: "UNREAD",
                      })
                    }
                    className="text-[10px] h-7 px-2"
                  >
                    Unread
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedInquiry.status === "READ" ? "default" : "outline"}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedInquiry.id,
                        status: "READ",
                      })
                    }
                    className="text-[10px] h-7 px-2"
                  >
                    Read
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedInquiry.status === "RESOLVED" ? "default" : "outline"}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedInquiry.id,
                        status: "RESOLVED",
                      })
                    }
                    className="text-[10px] h-7 px-2"
                  >
                    Resolved
                  </Button>
                </div>
              </div>

              {/* Sender Info Card */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Customer Name</span>
                    <span className="font-bold text-foreground">{selectedInquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Email Address</span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      {selectedInquiry.email}
                    </a>
                  </div>
                  {selectedInquiry.phone && (
                    <div>
                      <span className="text-muted-foreground text-[10px] block">Phone</span>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="font-medium text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Subject / Reference
                </span>
                <p className="text-xs font-bold text-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40">
                  {selectedInquiry.subject || "General Logistics Inquiry"}
                </p>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Customer Message
                </span>
                <div className="p-3.5 rounded-xl bg-card border border-border text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex items-center justify-between gap-3 bg-muted/20">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("Permanently delete this inquiry?")) {
                    deleteMutation.mutate(selectedInquiry.id);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="text-xs gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=RE: ${encodeURIComponent(
                    selectedInquiry.subject || "Logistics Inquiry"
                  )}`}
                  className="inline-flex"
                >
                  <Button size="sm" className="text-xs gap-1.5">
                    <Send className="h-3.5 w-3.5" />
                    <span>Reply via Email</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
