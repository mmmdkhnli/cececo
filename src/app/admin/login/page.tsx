import { getSiteSettings } from "@/db/queries/site";
import { DarkRoot } from "@/components/admin/dark-root";
import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";

export default async function AdminLoginPage() {
  const settings = await getSiteSettings();

  return (
    <DarkRoot>
      <main className="flex min-h-screen items-center justify-center bg-background px-[5%] text-foreground">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <img src={settings?.logoDark || "/logo/logo-dark.png"} alt="CECECO" className="mb-4 h-8 w-auto" />
            <CardTitle className="text-xl">Admin panel</CardTitle>
            <CardDescription>Enter your details to sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </main>
    </DarkRoot>
  );
}
