"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportStatusBadge } from "@/components/status-badge";
import { SupportDetailDrawer } from "@/components/support/support-detail-drawer";
import { useSupportRequests, ISSUE_TYPES } from "@/hooks/use-support";
import type { SupportRequest, SupportStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS: SupportStatus[] = ["open", "in_review", "resolved", "closed"];
const STATUS_LABEL: Record<SupportStatus, string> = {
  open: "Open",
  in_review: "In Review",
  resolved: "Resolved",
  closed: "Closed",
};
const ISSUE_LABEL: Record<string, string> = {
  damaged_book: "Damaged book",
  incorrect_book: "Incorrect book",
  delayed_delivery: "Delayed delivery",
  payment_problem: "Payment problem",
  other: "Other",
};

export default function SupportPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<SupportStatus | "all">("all");
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const [selected, setSelected] = useState<SupportRequest | null>(null);

  const { data, isLoading } = useSupportRequests({
    page,
    limit: 10,
    status: statusFilter,
    issueType: issueFilter,
  });

  const columns = useMemo<ColumnDef<SupportRequest>[]>(
    () => [
      {
        header: "Issue",
        id: "issueType",
        cell: ({ row }) => (
          <div className="min-w-[200px]">
            <p className="font-bold text-text-dark">
              {ISSUE_LABEL[row.original.issueType] ?? row.original.issueType}
            </p>
            <p className="text-[12px] text-text-medium truncate max-w-[260px]">
              {row.original.description}
            </p>
          </div>
        ),
      },
      {
        header: "Submitted by",
        id: "user",
        cell: ({ row }) => {
          const u = row.original.user;
          return (
            <span className="text-text-dark">{typeof u === "string" ? u : u.fullName}</span>
          );
        },
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <span className="text-text-medium">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        header: "Status",
        id: "status",
        cell: ({ row }) => <SupportStatusBadge status={row.original.status} />,
      },
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as SupportStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={issueFilter}
          onValueChange={(v) => {
            setIssueFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Issue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All issue types</SelectItem>
            {ISSUE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {ISSUE_LABEL[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyTitle="No support requests"
        emptyDescription="Nothing matches this filter right now."
        page={data?.page ?? page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        onRowClick={(req) => setSelected(req)}
      />

      <SupportDetailDrawer request={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
