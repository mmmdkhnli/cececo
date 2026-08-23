import Link from "next/link";

// Sits outside the (protected) and login segments, so it can't assume the
// sidebar layout — catches unmatched /admin/* paths that aren't under either.
export default function AdminSegmentNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-lightest px-6">
      <div className="w-full max-w-md rounded-card border border-neutral-lighter bg-white p-8 text-center">
        <p className="text-small font-semibold text-mountain-meadow-dark">404</p>
        <h1 className="mt-2 text-h4 font-bold text-neutral-darkest">Page not found</h1>
        <p className="mt-2 text-small text-neutral">The admin page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-button bg-mountain-meadow px-5 py-2.5 font-medium text-white transition-colors hover:bg-mountain-meadow-dark"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
