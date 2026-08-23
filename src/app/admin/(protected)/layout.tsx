import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getSiteSettings } from "@/db/queries/site";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/admin/ui/sidebar";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import { Toaster } from "@/components/admin/ui/sonner";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.userId) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar
          email={session.email ?? ""}
          name={session.name ?? ""}
          logoDark={settings?.logoDark || "/logo/logo-dark.png"}
        />
        <SidebarInset>
          <div className="flex items-center gap-2 border-b border-border p-4 md:hidden">
            <SidebarTrigger />
            <span className="text-sm font-semibold">Admin panel</span>
          </div>
          <div className="p-6 md:p-10">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  );
}
