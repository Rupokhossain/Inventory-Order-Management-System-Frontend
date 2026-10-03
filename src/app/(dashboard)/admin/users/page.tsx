"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService, PlatformUser } from "@/services/admin.service";
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Filter,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: () => adminService.getAllUsers(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "BLOCKED" }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(`User marked as ${variables.status}!`);
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update user status");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "ADMIN" | "MANAGER" | "CUSTOMER" }) =>
      adminService.updateUserRole(id, role),
    onSuccess: (data, variables) => {
      toast.success(`User role successfully changed to ${variables.role}!`);
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update user role");
    },
  });

  const filteredUsers = users.filter((u) => {
    const matchesRole =
      selectedRole === "ALL" ? true : u.role === selectedRole;
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const managerCount = users.filter((u) => u.role === "MANAGER").length;
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Directory & Access Governance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage system roles, account states, and security access controls across the organization.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Users
        </Button>
      </div>

      {/* KPI Cards Row (Invenza 4-Card Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Operators
            </span>
            <div className="text-2xl font-black text-foreground">{users.length}</div>
            <span className="text-[10px] text-muted-foreground">All accounts</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Admins
            </span>
            <div className="text-2xl font-black text-purple-600">{adminCount}</div>
            <span className="text-[10px] text-muted-foreground">Superuser tier</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Managers
            </span>
            <div className="text-2xl font-black text-amber-600">{managerCount}</div>
            <span className="text-[10px] text-muted-foreground">Logistics tier</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Customers
            </span>
            <div className="text-2xl font-black text-blue-600">{customerCount}</div>
            <span className="text-[10px] text-muted-foreground">End consumers</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Users" },
            { id: "ADMIN", label: "Admins" },
            { id: "MANAGER", label: "Managers" },
            { id: "CUSTOMER", label: "Customers" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === tab.id
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
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              Retrieving platform directory...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-sm font-bold text-foreground">No users found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No platform accounts match this filter condition.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                <tr>
                  <th className="px-4 py-3">User & Contact</th>
                  <th className="px-4 py-3">Access Tier (Role)</th>
                  <th className="px-4 py-3">Account State</th>
                  <th className="px-4 py-3">Registered On</th>
                  <th className="px-4 py-3 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((user) => {
                  const isBlocked = user.status === "BLOCKED";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {user.name?.slice(0, 2).toUpperCase() || "US"}
                          </div>
                          <div>
                            <span className="font-bold text-foreground text-xs block">
                              {user.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Mail className="h-2.5 w-2.5" />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td className="px-4 py-3.5">
                        <select
                          value={user.role}
                          disabled={updateRoleMutation.isPending}
                          onChange={(e) =>
                            updateRoleMutation.mutate({
                              id: user.id,
                              role: e.target.value as "ADMIN" | "MANAGER" | "CUSTOMER",
                            })
                          }
                          className="text-xs font-semibold rounded-md border border-border bg-background px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors hover:border-primary/50"
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="MANAGER">LOGISTICS MANAGER</option>
                          <option value="ADMIN">ADMINISTRATOR</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {isBlocked ? (
                          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2 py-0.5">
                            BLOCKED
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2 py-0.5">
                            ACTIVE
                          </Badge>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-muted-foreground text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        {isBlocked ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={toggleStatusMutation.isPending}
                            className="h-7 px-2.5 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/30 gap-1"
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                id: user.id,
                                status: "ACTIVE",
                              })
                            }
                          >
                            <UserCheck className="h-3 w-3" />
                            <span>Unblock</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              toggleStatusMutation.isPending ||
                              user.role === "ADMIN"
                            }
                            className="h-7 px-2.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/30 gap-1"
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                id: user.id,
                                status: "BLOCKED",
                              })
                            }
                          >
                            <UserX className="h-3 w-3" />
                            <span>Block User</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
