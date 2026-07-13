import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/types";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await apiClient.post<ApiResponse<{ url: string }>>(
        "/upload/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.data.url;
    },
  });
}
