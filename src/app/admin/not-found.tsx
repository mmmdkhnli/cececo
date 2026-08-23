import Link from "next/link";
import { DarkRoot } from "@/components/admin/dark-root";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";

export default function AdminSegmentNotFound() {
  return (
    <DarkRoot>
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <Card className="w-full max-w-md p-8 text-center">
          <p className="text-sm font-semibold text-primary">404</p>
          <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">The admin page you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild className="mt-6">
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        </Card>
      </div>
    </DarkRoot>
  );
}
