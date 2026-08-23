import type { SectionBulletRow } from "@/db/schema";
import { addSectionBullet, updateSectionBullet, deleteSectionBullet } from "@/app/admin/(protected)/pages/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";

export function SectionBulletManager({
  sectionId,
  pageSlug,
  bullets,
}: {
  sectionId: number;
  pageSlug: string;
  bullets: SectionBulletRow[];
}) {
  const addAction = addSectionBullet.bind(null, sectionId, pageSlug);
  const nextOrder = bullets.length === 0 ? 0 : Math.max(...bullets.map((b) => b.order)) + 1;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h2 className="text-lg font-semibold">List items</h2>

      <div className="flex flex-col gap-3">
        {bullets.map((bullet) => {
          const updateAction = updateSectionBullet.bind(null, bullet.id, pageSlug);
          return (
            <Card key={bullet.id} className="flex flex-row items-center gap-3 p-3">
              <form action={updateAction} className="flex flex-1 items-center gap-3">
                <Input name="text" defaultValue={bullet.text} className="flex-1" />
                <Input name="order" type="number" defaultValue={bullet.order} className="w-20" />
                <SubmitButton pendingText="Saving..." variant="outline">
                  Save
                </SubmitButton>
              </form>
              <DeleteButton action={deleteSectionBullet.bind(null, bullet.id, pageSlug)} />
            </Card>
          );
        })}
        {bullets.length === 0 && <p className="text-sm text-muted-foreground">No items added yet.</p>}
      </div>

      <Card className="flex flex-row items-center gap-3 border-dashed p-3">
        <form action={addAction} className="flex flex-1 items-center gap-3">
          <Input name="text" placeholder="New item" required className="flex-1" />
          <Input name="order" type="number" defaultValue={nextOrder} className="w-20" />
          <SubmitButton pendingText="Adding...">Add</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
