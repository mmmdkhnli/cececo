import Link from "next/link";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";

export default function AdminNotFound() {
  return (
    <Card className="flex min-h-[50vh] flex-col items-center justify-center p-10 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
      <Button asChild className="mt-6">
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </Card>
  );
}
