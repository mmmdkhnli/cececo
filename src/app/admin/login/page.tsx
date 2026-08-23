import { getSiteSettings } from "@/db/queries/site";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const settings = await getSiteSettings();

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-lightest px-[5%]">
      <div className="w-full max-w-sm rounded-card border border-neutral-lighter bg-white p-8 shadow-lg">
        <img src={settings?.logoLight || "/logo/logo-light.png"} alt="CECECO" className="mb-6 h-8 w-auto" />
        <h1 className="mb-1 text-h4 font-bold text-neutral-darkest">Admin panel</h1>
        <p className="mb-6 text-small text-neutral">Enter your details to sign in.</p>
        <LoginForm />
      </div>
    </main>
  );
}
