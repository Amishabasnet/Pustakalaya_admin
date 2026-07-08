import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Book, Paginated } from "@/lib/types";

export interface BookFilters {
  page: number;
  limit: number;
  search?: string;
  genre?: string;
  verified?: "all" | "verified" | "unverified";
}

export function useBooks(filters: BookFilters) {
  return useQuery({
    queryKey: ["admin", "books", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Paginated<Book>>>("/admin/books", {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
          genre: filters.genre || undefined,
          verified:
            filters.verified === "verified"
              ? true
              : filters.verified === "unverified"
                ? false
                : undefined,
        },
      });
      return res.data.data;
    },
    placeholderData: (prev) => prev,
  });
}

export type BookInput = Omit<
  Book,
  "_id" | "rating" | "totalReviews" | "createdAt" | "isVerified" | "isFeatured"
>;

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<BookInput>) => {
      const res = await apiClient.post<ApiResponse<Book>>("/books", input);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "books"] }),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<BookInput> }) => {
      const res = await apiClient.put<ApiResponse<Book>>(`/books/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "books"] }),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/books/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "books"] }),
  });
}

export function useToggleBookVerify() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch<ApiResponse<Book>>(`/admin/books/${id}/verify`);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "books"] }),
  });
}

export function useToggleBookFeature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch<ApiResponse<Book>>(`/admin/books/${id}/feature`);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "books"] }),
  });
}
