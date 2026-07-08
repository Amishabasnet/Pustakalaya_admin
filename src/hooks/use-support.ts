import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Paginated, SupportRequest, SupportStatus } from "@/lib/types";

export const ISSUE_TYPES = [
  "damaged_book",
  "incorrect_book",
  "delayed_delivery",
  "payment_problem",
  "other",
] as const;

export interface SupportFilters {
  page: number;
  limit: number;
  status?: SupportStatus | "all";
  issueType?: string;
}

export function useSupportRequests(filters: SupportFilters) {
  return useQuery({
    queryKey: ["admin", "support", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Paginated<SupportRequest>>>("/admin/support", {
        params: {
          page: filters.page,
          limit: filters.limit,
          status: filters.status && filters.status !== "all" ? filters.status : undefined,
          issueType: filters.issueType && filters.issueType !== "all" ? filters.issueType : undefined,
        },
      });
      return res.data.data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useUpdateSupportRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: SupportStatus;
      adminNote?: string;
    }) => {
      const res = await apiClient.patch<ApiResponse<SupportRequest>>(`/admin/support/${id}`, {
        status,
        adminNote,
      });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "support"] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}
