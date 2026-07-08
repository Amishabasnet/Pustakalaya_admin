"use client";

import { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/status-badge";
import { useUpdateOrderStatus } from "@/hooks/use-orders";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { MapPin, Package, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api-client";

const STATUS_FLOW: OrderStatus[] = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderDetailDrawer({
  order,
  onOpenChange,
}: {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [nextStatus, setNextStatus] = useState<OrderStatus | null>(null);
  const updateStatus = useUpdateOrderStatus();

  if (!order) {
    return <Drawer open={false} onOpenChange={onOpenChange}><DrawerContent title="" /></Drawer>;
  }

  const customer = typeof order.user === "string" ? null : order.user;
  const pendingStatus = nextStatus ?? order.status;

  async function handleUpdate() {
    if (!order || pendingStatus === order.status) return;
    try {
      await updateStatus.mutateAsync({ orderId: order.orderId, status: pendingStatus });
      toast.success(`Order marked as ${STATUS_LABEL[pendingStatus].toLowerCase()}.`);
      setNextStatus(null);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't update order status."));
    }
  }

  return (
    <Drawer open={!!order} onOpenChange={onOpenChange}>
      <DrawerContent title={order.orderId} description={formatDateTime(order.createdAt)}>
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 flex-wrap">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
            <span className="text-[12px] text-text-medium capitalize">
              {order.paymentMethod} · {order.deliveryOption}
            </span>
          </div>

          {/* Customer */}
          {customer && (
            <div>
              <p className="text-[13px] font-bold text-text-dark mb-1.5">Customer</p>
              <p className="text-[13.5px] text-text-dark">{customer.fullName}</p>
              <p className="text-[12.5px] text-text-medium">{customer.email}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-[13px] font-bold text-text-dark mb-2.5 flex items-center gap-1.5">
              <Package className="h-[14px] w-[14px]" /> Items ({order.items.length})
            </p>
            <ul className="space-y-2.5">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3 rounded-btn border border-border px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-text-dark truncate">{item.title}</p>
                    <p className="text-[11.5px] text-text-medium truncate">
                      {item.author} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-[13px] font-bold shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals */}
          <div className="rounded-btn bg-background border border-border px-4 py-3 space-y-1.5">
            <div className="flex justify-between text-[13px] text-text-medium">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13px] text-text-medium">
              <span>Delivery</span>
              <span>{formatCurrency(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between text-[14px] font-bold text-text-dark pt-1.5 border-t border-border">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div>
            <p className="text-[13px] font-bold text-text-dark mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-[14px] w-[14px]" /> Delivery address
            </p>
            <p className="text-[13px] text-text-dark leading-relaxed">
              {order.deliveryAddress.fullName} · {order.deliveryAddress.phone}
              <br />
              {order.deliveryAddress.street}, {order.deliveryAddress.city}
              {order.deliveryAddress.province ? `, ${order.deliveryAddress.province}` : ""}
            </p>
          </div>

          {/* Status history timeline */}
          {order.statusHistory?.length > 0 && (
            <div>
              <p className="text-[13px] font-bold text-text-dark mb-2.5">Status history</p>
              <ul className="space-y-3">
                {order.statusHistory.map((entry, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {i < order.statusHistory.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="text-[13px] font-bold text-text-dark capitalize">
                        {entry.status}
                      </p>
                      <p className="text-[11.5px] text-text-medium">
                        {formatDateTime(entry.changedAt)}
                        {entry.note ? ` · ${entry.note}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Update status */}
          <div className="border-t border-border pt-5">
            <p className="text-[13px] font-bold text-text-dark mb-2">Update status</p>
            <div className="flex gap-2.5">
              <Select value={pendingStatus} onValueChange={(v) => setNextStatus(v as OrderStatus)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FLOW.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleUpdate}
                isLoading={updateStatus.isPending}
                disabled={pendingStatus === order.status}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
