"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    console.error(error);
  }, [error]);

  if (isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-lightest px-6">
        <div className="w-full max-w-md rounded-card border border-neutral-lighter bg-white p-8 text-center">
          <p className="text-h4 font-bold text-neutral-darkest">Something went wrong</p>
          <p className="mt-2 text-small text-neutral">
            An unexpected error occurred. Please try again.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="rounded-button bg-mountain-meadow px-5 py-2.5 font-medium text-white transition-colors hover:bg-mountain-meadow-dark"
            >
              Try again
            </button>
            <Link
              href="/admin"
              className="rounded-button border border-neutral-lighter px-5 py-2.5 font-medium text-neutral-darkest transition-colors hover:bg-neutral-lightest"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="scheme-1 flex min-h-screen items-center justify-center px-[5%] py-24">
      <div className="container max-w-md text-center">
        <h1 className="text-h2 font-bold">Something went wrong</h1>
        <p className="mt-3 text-medium text-neutral">
          We hit an unexpected error. Please try again, or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Button type="button" onClick={() => retry()}>
            Try again
          </Button>
          <Button asChild variant="link">
            <Link href="/">Back to homepage</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
