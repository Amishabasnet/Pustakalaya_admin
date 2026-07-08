"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { BookMarked } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !admin) router.replace("/login");
  }, [isLoading, admin, router]);

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center animate-pulse">
            <BookMarked className="h-5 w-5 text-text-light" />
          </div>
          <p className="text-[13px] text-text-medium font-medium">Loading Pustakalaya Admin…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
