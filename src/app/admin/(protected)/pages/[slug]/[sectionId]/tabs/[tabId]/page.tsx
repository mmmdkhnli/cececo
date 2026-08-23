import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { section, sectionTab } from "@/db/schema";
import { TAB_STYLE_BY_COMPONENT } from "@/lib/section-field-config";
import { updateSectionTab } from "@/app/admin/(protected)/pages/actions";
import { SectionTabForm } from "@/components/admin/section-tab-form";

export default async function EditSectionTabPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string; tabId: string }>;
}) {
  const { slug, sectionId, tabId } = await params;
  const id = Number(sectionId);
  const [row] = await db.select().from(section).where(eq(section.id, id));
  if (!row) notFound();

  const [tab] = await db.select().from(sectionTab).where(eq(sectionTab.id, Number(tabId)));
  if (!tab) notFound();

  const style = TAB_STYLE_BY_COMPONENT[row.componentKey] ?? "media-tab";
  const action = updateSectionTab.bind(null, tab.id, id, slug);

  return (
    <div>
      <Link href={`/admin/pages/${slug}/${id}`} className="text-sm text-muted-foreground hover:text-foreground">
        ← {row.componentKey}
      </Link>
      <h1 className="mt-2 mb-8 text-3xl font-bold">Edit tab</h1>
      <SectionTabForm key={tab.id} action={action} style={style} defaultValues={tab} nextOrder={tab.order} />
    </div>
  );
}
