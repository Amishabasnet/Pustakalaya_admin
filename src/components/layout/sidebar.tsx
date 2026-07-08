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
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/users", label: "Users", icon: Users },
  { href: "/support", label: "Support", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-[220px] shrink-0 border-r border-border bg-surface h-screen sticky top-0">
      <div className="h-[68px] flex items-center gap-2.5 px-5 border-b border-border">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <BookMarked className="h-[18px] w-[18px] text-text-light" strokeWidth={2.2} />
        </div>
        <div className="leading-tight">
          <p className="font-display font-bold text-[16.5px] text-text-dark">Pustakalaya</p>
          <p className="text-[10.5px] font-bold tracking-[1.5px] uppercase text-text-medium">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-btn text-[13.5px] font-bold transition-colors",
                active
                  ? "bg-primary-light text-primary-dark"
                  : "text-text-medium hover:bg-black/[0.04] hover:text-text-dark"
              )}
            >
              <Icon className="h-[17px] w-[17px]" strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <p className="text-[11px] text-text-medium leading-relaxed">
          Pustakalaya Admin v1.0
        </p>
      </div>
    </aside>
  );
}
