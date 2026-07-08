import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "info";
  trend?: string;
}) {
  const accentClasses: Record<string, string> = {
    primary: "bg-primary-light text-primary-dark",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    info: "bg-info-light text-info",
  };

  return (
    <div className="bg-surface rounded-card border border-border/70 shadow-[0_4px_12px_rgba(26,20,14,0.07)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12.5px] font-bold text-text-medium uppercase tracking-[0.5px]">
            {label}
          </p>
          <p className="font-display font-bold text-[26px] text-text-dark mt-1.5">{value}</p>
          {trend && <p className="text-[12px] text-text-medium mt-1">{trend}</p>}
        </div>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", accentClasses[accent])}>
          <Icon className="h-[19px] w-[19px]" strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
