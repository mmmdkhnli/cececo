import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getSiteSettings } from "@/db/queries/site";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { DarkRoot } from "@/components/admin/dark-root";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/admin/ui/sidebar";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import { Toaster } from "@/components/admin/ui/sonner";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.userId) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <DarkRoot>
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar
            variant="inset"
            email={session.email ?? ""}
            name={session.name ?? ""}
            logoLight={settings?.logoLight || "/logo/logo-light.png"}
            logoDark={settings?.logoDark || "/logo/logo-dark.png"}
          />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col gap-4 p-4 text-foreground md:gap-6 md:p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </DarkRoot>
  );
}
