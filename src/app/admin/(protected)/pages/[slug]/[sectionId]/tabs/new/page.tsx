import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { section, sectionTab } from "@/db/schema";
import { TAB_STYLE_BY_COMPONENT } from "@/lib/section-field-config";
import { createSectionTab } from "@/app/admin/(protected)/pages/actions";
import { SectionTabForm } from "@/components/admin/section-tab-form";

export default async function NewSectionTabPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string }>;
}) {
  const { slug, sectionId } = await params;
  const id = Number(sectionId);
  const [row] = await db.select().from(section).where(eq(section.id, id));
  if (!row) notFound();

  const existing = await db.select().from(sectionTab).where(eq(sectionTab.sectionId, id)).orderBy(asc(sectionTab.order));
  const nextOrder = existing.length === 0 ? 0 : Math.max(...existing.map((t) => t.order)) + 1;
  const style = TAB_STYLE_BY_COMPONENT[row.componentKey] ?? "media-tab";

  const action = createSectionTab.bind(null, id, slug);

  return (
    <div>
      <Link href={`/admin/pages/${slug}/${id}`} className="text-sm text-muted-foreground hover:text-foreground">
        ← {row.componentKey}
      </Link>
      <h1 className="mt-2 mb-8 text-3xl font-bold">New tab</h1>
      <SectionTabForm action={action} style={style} nextOrder={nextOrder} />
    </div>
  );
}
