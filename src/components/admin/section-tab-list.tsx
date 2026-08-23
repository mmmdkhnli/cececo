import Link from "next/link";
import type { SectionTabRow } from "@/db/schema";
import { deleteSectionTab } from "@/app/admin/(protected)/pages/actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function SectionTabList({
  pageSlug,
  sectionId,
  tabs,
}: {
  pageSlug: string;
  sectionId: number;
  tabs: SectionTabRow[];
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-medium font-semibold text-neutral-darkest">Tabs</h2>
        <Link
          href={`/admin/pages/${pageSlug}/${sectionId}/tabs/new`}
          className="rounded-button bg-mountain-meadow px-4 py-1.5 text-small font-medium text-white transition-colors hover:bg-mountain-meadow-dark"
        >
          New tab
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {tabs.map((tab) => (
          <div key={tab.id} className="flex items-center justify-between gap-4 rounded-card border border-neutral-lighter p-4">
            <div>
              <p className="text-small font-semibold text-neutral-darkest">{tab.title || tab.tabLabel || "(untitled)"}</p>
              <p className="text-tiny text-neutral">order: {tab.order}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/pages/${pageSlug}/${sectionId}/tabs/${tab.id}`}
                className="rounded-button border border-neutral-lighter px-3 py-1.5 text-small font-medium text-neutral-darkest transition-colors hover:border-mountain-meadow"
              >
                Edit
              </Link>
              <DeleteButton action={deleteSectionTab.bind(null, tab.id, pageSlug)} />
            </div>
          </div>
        ))}
        {tabs.length === 0 && <p className="text-small text-neutral">No tabs added yet.</p>}
      </div>
    </div>
  );
}
