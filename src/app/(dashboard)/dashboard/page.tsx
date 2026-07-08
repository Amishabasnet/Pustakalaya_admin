"use client";

import { useDashboardStats } from "@/hooks/use-dashboard";
import { StatCard } from "@/components/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrderStatusBadge, SupportStatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BookOpen, Users, ShoppingCart, Wallet, AlertTriangle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import type { OrderStatus } from "@/lib/types";

const STATUS_ORDER: OrderStatus[] = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[104px] rounded-card bg-black/[0.04]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-[340px] rounded-card bg-black/[0.04]" />
        <div className="h-[340px] rounded-card bg-black/[0.04]" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-8 w-8 text-warning mb-3" />
        <p className="font-bold text-text-dark">Couldn&apos;t load dashboard data.</p>
        <p className="text-[13px] text-text-medium mt-1">
          Check that the backend is running and reachable.
        </p>
      </div>
    );
  }

  const chartData = STATUS_ORDER.map((status) => ({
    status: STATUS_LABELS[status],
    count: data.ordersByStatus?.[status] ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Books" value={data.totalBooks.toLocaleString()} icon={BookOpen} accent="primary" />
        <StatCard label="Total Users" value={data.totalUsers.toLocaleString()} icon={Users} accent="info" />
        <StatCard label="Total Orders" value={data.totalOrders.toLocaleString()} icon={ShoppingCart} accent="warning" />
        <StatCard label="Revenue" value={formatCurrency(data.totalRevenue)} icon={Wallet} accent="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Orders by status chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Orders by status</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D6" vertical={false} />
                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 12, fill: "#6B6B6B", fontFamily: "var(--font-lato)" }}
                  axisLine={{ stroke: "#E8E0D6" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#6B6B6B", fontFamily: "var(--font-lato)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(232,96,44,0.06)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8E0D6",
                    fontFamily: "var(--font-lato)",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="count" fill="#E8602C" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low stock</CardTitle>
            <Link href="/books" className="text-[12.5px] font-bold text-primary hover:text-primary-dark">
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {data.lowStockBooks?.length ? (
              <ul className="space-y-3">
                {data.lowStockBooks.slice(0, 6).map((book) => (
                  <li key={book._id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-bold text-text-dark truncate">{book.title}</p>
                      <p className="text-[12px] text-text-medium truncate">{book.author}</p>
                    </div>
                    <span className="shrink-0 text-[11.5px] font-bold text-danger bg-danger-light rounded-full px-2.5 py-1">
                      {book.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-text-medium py-6 text-center">
                All titles are well stocked.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent orders</CardTitle>
            <Link href="/orders" className="text-[12.5px] font-bold text-primary hover:text-primary-dark">
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {data.recentOrders?.length ? (
              <ul className="divide-y divide-border">
                {data.recentOrders.slice(0, 6).map((order) => (
                  <li key={order._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-bold text-text-dark">{order.orderId}</p>
                      <p className="text-[12px] text-text-medium">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[13px] font-bold text-text-dark">
                        {formatCurrency(order.total)}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-text-medium py-6 text-center">No orders yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent support requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent support requests</CardTitle>
            <Link href="/support" className="text-[12.5px] font-bold text-primary hover:text-primary-dark">
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {data.recentSupportRequests?.length ? (
              <ul className="divide-y divide-border">
                {data.recentSupportRequests.slice(0, 6).map((req) => (
                  <li key={req._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-bold text-text-dark truncate capitalize">
                        {req.issueType.replace(/_/g, " ")}
                      </p>
                      <p className="text-[12px] text-text-medium truncate">{req.description}</p>
                    </div>
                    <SupportStatusBadge status={req.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-text-medium py-6 text-center">No open requests.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
