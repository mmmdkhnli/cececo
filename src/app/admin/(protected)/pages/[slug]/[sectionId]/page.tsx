import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { section, sectionImage, sectionTab, sectionBullet } from "@/db/schema";
import { SECTION_FIELD_CONFIG } from "@/lib/section-field-config";
import { SectionForm } from "@/components/admin/section-form";
import { SectionImageManager } from "@/components/admin/section-image-manager";
import { SectionBulletManager } from "@/components/admin/section-bullet-manager";
import { SectionTabList } from "@/components/admin/section-tab-list";

export default async function AdminSectionEditPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string }>;
}) {
  const { slug, sectionId } = await params;
  const id = Number(sectionId);
  const [row] = await db.select().from(section).where(eq(section.id, id));
  if (!row) notFound();

  const config = SECTION_FIELD_CONFIG[row.componentKey] ?? { fields: [] };

  const [images, tabs, bullets] = await Promise.all([
    config.repeater === "images"
      ? db.select().from(sectionImage).where(eq(sectionImage.sectionId, id)).orderBy(asc(sectionImage.order))
      : Promise.resolve([]),
    config.repeater === "tabs"
      ? db.select().from(sectionTab).where(eq(sectionTab.sectionId, id)).orderBy(asc(sectionTab.order))
      : Promise.resolve([]),
    config.repeater === "bullets"
      ? db.select().from(sectionBullet).where(eq(sectionBullet.sectionId, id)).orderBy(asc(sectionBullet.order))
      : Promise.resolve([]),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link href={`/admin/pages/${slug}`} className="text-small text-neutral hover:text-neutral-darkest">
          ← {slug} sections
        </Link>
        <h1 className="mt-2 text-h3 font-bold text-neutral-darkest">{row.componentKey}</h1>
      </div>

      <SectionForm key={row.id} section={row} pageSlug={slug} />

      {config.repeater === "images" && (
        <SectionImageManager sectionId={id} pageSlug={slug} images={images} />
      )}
      {config.repeater === "bullets" && (
        <SectionBulletManager sectionId={id} pageSlug={slug} bullets={bullets} />
      )}
      {config.repeater === "tabs" && <SectionTabList pageSlug={slug} sectionId={id} tabs={tabs} />}
    </div>
  );
}
