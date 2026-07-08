import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1 p-4 md:p-7">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
