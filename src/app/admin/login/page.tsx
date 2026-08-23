import { getSiteSettings } from "@/db/queries/site";
import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";

export default async function AdminLoginPage() {
  const settings = await getSiteSettings();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-[5%]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <img src={settings?.logoLight || "/logo/logo-light.png"} alt="CECECO" className="mb-4 h-8 w-auto" />
          <CardTitle className="text-xl">Admin panel</CardTitle>
          <CardDescription>Enter your details to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
