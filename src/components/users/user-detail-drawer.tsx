"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { useUserDetail } from "@/hooks/use-users";
import { formatDate } from "@/lib/utils";
 

export function UserDetailDrawer({
  userId,
  onOpenChange,
}: {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: user } = useUserDetail(userId);

  if (!user) {
    return <Drawer open={false} onOpenChange={onOpenChange}><DrawerContent title="" /></Drawer>;
  }

  return (
    <Drawer open={!!userId} onOpenChange={onOpenChange}>
      <DrawerContent title={user.fullName} description={user.email}>
        <div className="space-y-6">
          <div>
            <p className="text-[13px] font-bold text-text-dark mb-1.5">Member</p>
            <p className="text-[13.5px] text-text-dark">{user.fullName}</p>
            <p className="text-[12.5px] text-text-medium">{user.email}</p>
          </div>

          <div className="rounded-btn bg-background border border-border px-4 py-3">
            <div className="flex justify-between text-[13px] text-text-medium">
              <span>Phone</span>
              <span>{user.phoneNumber ?? "—"}</span>
            </div>
            <div className="flex justify-between text-[13px] text-text-medium">
              <span>Joined</span>
              <span>{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex justify-between text-[13px] text-text-medium">
              <span>Status</span>
              <span>
                <Badge variant={user.isActive ? "success" : "danger"}>
                  {user.isActive ? "Active" : "Deactivated"}
                </Badge>
              </span>
            </div>
          </div>

          {user.orders && user.orders.length > 0 && (
            <div>
              <p className="text-[13px] font-bold text-text-dark mb-2.5">Recent orders</p>
              <DataTable
                columns={[]}
                data={user.orders}
                emptyTitle="No orders"
                page={1}
                totalPages={1}
              />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
