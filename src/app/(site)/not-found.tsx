import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SiteNotFound() {
  return (
    <main className="scheme-1 flex min-h-[60vh] items-center justify-center px-[5%] py-24">
      <div className="container max-w-md text-center">
        <p className="text-small font-semibold text-mountain-meadow-dark">404</p>
        <h1 className="mt-2 text-h2 font-bold">Page not found</h1>
        <p className="mt-3 text-medium text-neutral">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Button asChild>
            <Link href="/">Back to homepage</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
