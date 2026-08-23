import Link from "next/link";

// Renders inside the protected admin layout (sidebar stays visible), for
// notFound() calls or bad IDs within authenticated admin sub-routes.
export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-card border border-neutral-lighter bg-white p-10 text-center">
      <p className="text-small font-semibold text-mountain-meadow-dark">404</p>
      <h1 className="mt-2 text-h3 font-bold text-neutral-darkest">Page not found</h1>
      <p className="mt-2 text-medium text-neutral">The page you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
      <Link
        href="/admin"
        className="mt-6 rounded-button bg-mountain-meadow px-5 py-2.5 font-medium text-white transition-colors hover:bg-mountain-meadow-dark"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
