import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getSiteSettings } from "@/db/queries/site";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.userId) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-neutral-lightest">
      <AdminSidebar
        email={session.email ?? ""}
        name={session.name ?? ""}
        logoDark={settings?.logoDark || "/logo/logo-dark.png"}
      />
      <div className="ml-64 px-6 py-8 md:px-10 md:py-10">{children}</div>
    </div>
  );
}
