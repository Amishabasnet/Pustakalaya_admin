"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/status-badge";
import { OrderDetailDrawer } from "@/components/orders/order-detail-drawer";
import { useOrders } from "@/hooks/use-orders";
import { useDebounce } from "@/hooks/use-debounce";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search } from "lucide-react";

const ORDER_STATUSES: OrderStatus[] = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 400);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading } = useOrders({
    page,
    limit: 10,
    search,
    status: statusFilter,
    paymentStatus: paymentFilter,
  });

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        header: "Order",
        accessorKey: "orderId",
        cell: ({ row }) => (
          <div>
            <p className="font-bold text-text-dark">{row.original.orderId}</p>
            <p className="text-[12px] text-text-medium">{formatDate(row.original.createdAt)}</p>
          </div>
        ),
      },
      {
        header: "Customer",
        id: "customer",
        cell: ({ row }) => {
          const u = row.original.user;
          return (
            <span className="text-text-dark">
              {typeof u === "string" ? u : u.fullName}
            </span>
          );
        },
      },
      {
        header: "Items",
        id: "items",
        cell: ({ row }) => (
          <span className="text-text-medium">{row.original.items.length}</span>
        ),
      },
      {
        header: "Total",
        accessorKey: "total",
        cell: ({ row }) => (
          <span className="font-bold text-text-dark">{formatCurrency(row.original.total)}</span>
        ),
      },
      {
        header: "Payment",
        id: "paymentStatus",
        cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
      },
      {
        header: "Status",
        id: "status",
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
      },
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-medium" />
          <Input
            placeholder="Search order ID…"
            className="pl-10"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as OrderStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paymentFilter}
            onValueChange={(v) => {
              setPaymentFilter(v as PaymentStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              {PAYMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyTitle="No orders found"
        emptyDescription="Try a different search or filter."
        page={data?.page ?? page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        onRowClick={(order) => setSelectedOrder(order)}
      />

      <OrderDetailDrawer order={selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)} />
    </div>
  );
}
