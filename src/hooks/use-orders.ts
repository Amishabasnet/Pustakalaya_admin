import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Order } from "@/lib/types";

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await apiClient.patch<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, {
        status,
      });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}
