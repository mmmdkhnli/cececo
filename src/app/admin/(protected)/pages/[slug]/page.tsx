import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { page, section } from "@/db/schema";
import { SECTION_LABELS } from "@/lib/section-field-config";
import { Badge } from "@/components/admin/ui/badge";
import { Card } from "@/components/admin/ui/card";
import { CUSTOM_SECTION_TYPES, isCustomPage } from "@/lib/custom-pages";
import { PageSettingsForm } from "@/components/admin/page-settings-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { addPageSection, deletePage, deletePageSection, updatePageSettings } from "../actions";

export default async function AdminPageSectionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [pageRow] = await db.select().from(page).where(eq(page.slug, slug));
  if (!pageRow) notFound();

  const sections = await db
    .select()
    .from(section)
    .where(eq(section.pageId, pageRow.id))
    .orderBy(asc(section.order));

  const custom = isCustomPage(slug);

  return (
    <div>
      <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground">
        ← All pages
      </Link>
      <div className="mt-2 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{pageRow.title}</h1>
        {custom && (
          <div className="flex items-center gap-2">
            <a href={`/${slug}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary">
              View page ↗
            </a>
            <DeleteButton
              action={deletePage.bind(null, pageRow.id)}
              confirmMessage="The page and all of its sections will be deleted. Remove any navbar link pointing to it too."
            />
          </div>
        )}
      </div>
      {custom && (
        <Card className="mt-6 p-5">
          <p className="mb-4 font-semibold">Page settings</p>
          <PageSettingsForm key={pageRow.updatedAt.toString()} action={updatePageSettings.bind(null, pageRow.id)} defaultValues={pageRow} />
        </Card>
      )}
      <p className="mt-6 text-muted-foreground">
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
          <div key={s.id} className="flex items-center gap-2">
            <Link href={`/admin/pages/${slug}/${s.id}`} className="flex-1">
              <Card className="flex flex-row items-center justify-between p-4 transition-colors hover:border-primary">
                <p className="font-semibold">
                  {SECTION_LABELS[s.componentKey] ?? s.componentKey}
                  {s.heading && <span className="ml-2 font-normal text-muted-foreground">— {s.heading}</span>}
                </p>
                <Badge variant="secondary">{s.scheme}</Badge>
              </Card>
            </Link>
            {custom && <DeleteButton action={deletePageSection.bind(null, s.id)} />}
          </div>
        ))}
      </div>

      {custom && (
        <form action={addPageSection.bind(null, pageRow.id)} className="mt-6 flex max-w-md items-end gap-3">
          <div className="flex-1">
            <Select name="componentKey" defaultValue="rich-content">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUSTOM_SECTION_TYPES.map((key) => (
                  <SelectItem key={key} value={key}>
                    {SECTION_LABELS[key] ?? key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SubmitButton pendingText="Adding...">Add section</SubmitButton>
        </form>
      )}
    </div>
  );
}
