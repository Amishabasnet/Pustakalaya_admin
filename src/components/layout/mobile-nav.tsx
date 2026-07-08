"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Users,
  LifeBuoy,
  BookMarked,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/users", label: "Users", icon: Users },
  { href: "/support", label: "Support", icon: LifeBuoy },
];

export function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-surface flex flex-col shadow-2xl">
        <div className="h-[68px] flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <BookMarked className="h-[18px] w-[18px] text-text-light" />
            </div>
            <p className="font-display font-bold text-[16.5px] text-text-dark">Pustakalaya</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-btn hover:bg-black/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-btn text-[13.5px] font-bold transition-colors",
                  active
                    ? "bg-primary-light text-primary-dark"
                    : "text-text-medium hover:bg-black/[0.04] hover:text-text-dark"
                )}
              >
                <Icon className="h-[17px] w-[17px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
