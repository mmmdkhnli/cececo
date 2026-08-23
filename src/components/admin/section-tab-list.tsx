import Link from "next/link";
import type { SectionTabRow } from "@/db/schema";
import { deleteSectionTab } from "@/app/admin/(protected)/pages/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";

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
        <h2 className="text-lg font-semibold">Tabs</h2>
        <Button asChild size="sm">
          <Link href={`/admin/pages/${pageSlug}/${sectionId}/tabs/new`}>New tab</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {tabs.map((tab) => (
          <Card key={tab.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-semibold">{tab.title || tab.tabLabel || "(untitled)"}</p>
              <p className="text-xs text-muted-foreground">order: {tab.order}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/pages/${pageSlug}/${sectionId}/tabs/${tab.id}`}>Edit</Link>
              </Button>
              <DeleteButton action={deleteSectionTab.bind(null, tab.id, pageSlug)} />
            </div>
          </Card>
        ))}
        {tabs.length === 0 && <p className="text-sm text-muted-foreground">No tabs added yet.</p>}
      </div>
    </div>
  );
}
