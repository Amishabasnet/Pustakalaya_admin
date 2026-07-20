import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AdminUser, ApiResponse, Order, Paginated } from "@/lib/types";

export interface UserFilters {
  page: number;
  limit: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Paginated<AdminUser>>>("/admin/users", {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
          isActive:
            filters.status === "active" ? true : filters.status === "inactive" ? false : undefined,
        },
      });
      return res.data.data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "users", "detail", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<AdminUser & { orders: Order[] }>>(
        `/admin/users/${id}`
      );
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/status`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete<ApiResponse<null>>(`/admin/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}