import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { page, section } from "@/db/schema";
import { SECTION_LABELS } from "@/lib/section-field-config";
import { Badge } from "@/components/admin/ui/badge";
import { Card } from "@/components/admin/ui/card";

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
      <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground">
        ← All pages
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{pageRow.title}</h1>
      <p className="mt-1 text-muted-foreground">
        Sections are shown in order — {sections.length} section(s). For Team, Blog, and Partners, use the
        &quot;Content&quot; sections in the left menu; the ones here are each section&apos;s own text, image, and CTA
        fields.
      </p>

      {slug === "home" && (
        <Link href="/admin/hero-slides">
          <Card className="mt-6 flex flex-row items-center justify-between border-primary bg-primary/5 p-4 transition-colors hover:border-primary">
            <p className="font-semibold">Hero</p>
            <span className="text-sm font-medium text-primary">Manage →</span>
          </Card>
        </Link>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {sections.map((s) => (
          <Link key={s.id} href={`/admin/pages/${slug}/${s.id}`}>
            <Card className="flex flex-row items-center justify-between p-4 transition-colors hover:border-primary">
              <p className="font-semibold">{SECTION_LABELS[s.componentKey] ?? s.componentKey}</p>
              <Badge variant="secondary">{s.scheme}</Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
