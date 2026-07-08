"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { initials } from "@/lib/utils";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { MobileNav } from "./mobile-nav";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/books": "Books",
  "/orders": "Orders",
  "/users": "Users",
  "/support": "Support",
};

function titleForPath(pathname: string): string {
  const match = Object.keys(TITLES).find(
    (key) => pathname === key || pathname.startsWith(key + "/")
  );
  return match ? TITLES[match] : "Pustakalaya Admin";
}

export function Topbar() {
  const { admin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const title = titleForPath(pathname);

  return (
    <>
      <header className="h-[68px] shrink-0 border-b border-border bg-surface flex items-center justify-between px-4 md:px-7 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-btn hover:bg-black/5"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display font-bold text-[19px] md:text-[21px] text-text-dark">
            {title}
          </h1>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-btn hover:bg-black/[0.04] transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary text-text-light flex items-center justify-center text-[12px] font-bold shrink-0">
                {admin ? initials(admin.fullName) : "A"}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-[13px] font-bold text-text-dark">
                  {admin?.fullName ?? "Admin"}
                </p>
                <p className="text-[11px] text-text-medium">{admin?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-text-medium hidden sm:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="bg-surface rounded-card border border-border shadow-[0_6px_18px_rgba(26,20,14,0.1)] min-w-[180px] p-1.5 z-50"
            >
              <DropdownMenu.Item
                onSelect={() => logout()}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-btn text-[13.5px] font-bold text-danger hover:bg-danger-light outline-none cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </header>

      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </>
  );
}
