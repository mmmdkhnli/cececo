import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { page, section } from "@/db/schema";
import { SECTION_LABELS } from "@/lib/section-field-config";

export default async function AdminPageSectionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [pageRow] = await db.select().from(page).where(eq(page.slug, slug));
  if (!pageRow) notFound();

  const sections = await db
    .select()
    .from(section)
    .where(eq(section.pageId, pageRow.id))
    .orderBy(asc(section.order));

  return (
    <div>
      <Link href="/admin/pages" className="text-small text-neutral hover:text-neutral-darkest">
        ← All pages
      </Link>
      <h1 className="mt-2 text-h3 font-bold text-neutral-darkest">{pageRow.title}</h1>
      <p className="mt-1 text-medium text-neutral">
        Sections are shown in order — {sections.length} section(s). For Team, Blog, and Partners, use the
        &quot;Content&quot; sections in the left menu; the ones here are each section&apos;s own text, image, and CTA
        fields.
      </p>

      {slug === "home" && (
        <Link
          href="/admin/hero-slides"
          className="mt-6 flex items-center justify-between rounded-card border border-mountain-meadow bg-mountain-meadow-lightest p-4 transition-colors hover:border-mountain-meadow-dark"
        >
          <p className="font-semibold text-neutral-darkest">Hero</p>
          <span className="text-small font-medium text-mountain-meadow-darker">Manage →</span>
        </Link>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {sections.map((s) => (
          <Link
            key={s.id}
            href={`/admin/pages/${slug}/${s.id}`}
            className="flex items-center justify-between rounded-card border border-neutral-lighter bg-white p-4 transition-colors hover:border-mountain-meadow"
          >
            <p className="font-semibold text-neutral-darkest">{SECTION_LABELS[s.componentKey] ?? s.componentKey}</p>
            <span className="rounded-badge bg-neutral-lightest px-2 py-1 text-tiny font-semibold text-neutral-dark">
              {s.scheme}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
