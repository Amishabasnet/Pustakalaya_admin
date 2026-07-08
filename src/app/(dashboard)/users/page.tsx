"use client";

import { useMemo, useState, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { UserDetailDrawer } from "../../../components/users/user-detail-drawer";
import { useUsers, useToggleUserStatus } from "../../../hooks/use-users";
import { useDebounce } from "@/hooks/use-debounce";
import type { AdminUser } from "@/lib/types";
import { formatDate, initials } from "@/lib/utils";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api-client";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 400);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data, isLoading } = useUsers({ page, limit: 10, search, status: statusFilter });
  const toggleStatus = useToggleUserStatus();

  const handleToggle = useCallback(async (user: AdminUser) => {
    try {
      await toggleStatus.mutateAsync(user._id);
      toast.success(user.isActive ? "Account deactivated." : "Account activated.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't update account status."));
    }
  }, [toggleStatus]);

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        header: "Member",
        accessorKey: "fullName",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="h-9 w-9 rounded-full bg-primary/15 text-primary-dark flex items-center justify-center text-[12px] font-bold shrink-0">
              {initials(row.original.fullName)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-text-dark truncate max-w-[180px]">
                {row.original.fullName}
              </p>
              <p className="text-[12px] text-text-medium truncate max-w-[180px]">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Phone",
        accessorKey: "phoneNumber",
        cell: ({ row }) => (
          <span className="text-text-medium">{row.original.phoneNumber}</span>
        ),
      },
      {
        header: "Joined",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <span className="text-text-medium">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        header: "Status",
        id: "status",
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "success" : "danger"} dot>
            {row.original.isActive ? "Active" : "Deactivated"}
          </Badge>
        ),
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
            <Switch
              checked={row.original.isActive}
              onCheckedChange={() => handleToggle(row.original)}
            />
          </div>
        ),
      },
    ],
    [handleToggle]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-medium" />
          <Input
            placeholder="Search name or email…"
            className="pl-10"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as typeof statusFilter);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All members</SelectItem>
            <SelectItem value="active">Active only</SelectItem>
            <SelectItem value="inactive">Deactivated only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyTitle="No members found"
        emptyDescription="Try a different search or filter."
        page={data?.page ?? page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        onRowClick={(user) => setSelectedUserId(user._id)}
      />

      <UserDetailDrawer userId={selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)} />
    </div>
  );
}
