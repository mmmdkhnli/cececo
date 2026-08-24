import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "relume-icons";

export function NotFoundContent() {
  return (
    <section className="scheme-1 alternate relative flex min-h-[70vh] items-center justify-center overflow-hidden px-[5%] py-24">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[11rem] leading-none font-bold text-white-10 md:text-[16rem]"
      >
        404
      </span>
      <div className="relative container max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-white-10 md:mt-10">
          <Search className="size-7 text-scheme-text" />
        </div>
        <p className="mb-3 font-semibold text-scheme-accent">Error 404</p>
        <h1 className="mb-5 text-h1 font-bold text-scheme-text md:mb-6">Page not found</h1>
        <p className="text-medium text-scheme-text-muted">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved, renamed, or no
          longer exists.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild variant="alternate">
            <Link href="/">Back to homepage</Link>
          </Button>
          <Button asChild variant="link" iconRight={<ChevronRight className="text-scheme-text" />}>
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
