import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PaymentStatus, SupportStatus } from "@/lib/types";

const ORDER_STATUS_VARIANT: Record<OrderStatus, "neutral" | "primary" | "success" | "warning" | "danger" | "info"> = {
  placed: "info",
  confirmed: "primary",
  processing: "warning",
  shipped: "warning",
  delivered: "success",
  cancelled: "danger",
};

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={ORDER_STATUS_VARIANT[status]} dot>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}

const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, "neutral" | "success" | "warning" | "danger"> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "neutral",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant={PAYMENT_STATUS_VARIANT[status]} dot>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

const SUPPORT_STATUS_VARIANT: Record<SupportStatus, "neutral" | "warning" | "success" | "info"> = {
  open: "warning",
  in_review: "info",
  resolved: "success",
  closed: "neutral",
};

const SUPPORT_STATUS_LABEL: Record<SupportStatus, string> = {
  open: "Open",
  in_review: "In Review",
  resolved: "Resolved",
  closed: "Closed",
};

export function SupportStatusBadge({ status }: { status: SupportStatus }) {
  return (
    <Badge variant={SUPPORT_STATUS_VARIANT[status]} dot>
      {SUPPORT_STATUS_LABEL[status]}
    </Badge>
  );
}
