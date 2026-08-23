import type { SectionBulletRow } from "@/db/schema";
import { addSectionBullet, updateSectionBullet, deleteSectionBullet } from "@/app/admin/(protected)/pages/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";

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
      <h2 className="text-medium font-semibold text-neutral-darkest">List items</h2>

      <div className="flex flex-col gap-3">
        {bullets.map((bullet) => {
          const updateAction = updateSectionBullet.bind(null, bullet.id, pageSlug);
          return (
            <div
              key={bullet.id}
              className="flex items-center gap-3 rounded-card border border-neutral-lighter p-3"
            >
              <form action={updateAction} className="flex flex-1 items-center gap-3">
                <input name="text" defaultValue={bullet.text} className="admin-input flex-1" />
                <input name="order" type="number" defaultValue={bullet.order} className="admin-input w-20" />
                <SubmitButton
                  pendingText="Saving..."
                  className="border border-mountain-meadow bg-transparent px-3 py-1.5 text-mountain-meadow-dark hover:bg-mountain-meadow-lightest"
                >
                  Save
                </SubmitButton>
              </form>
              <DeleteButton action={deleteSectionBullet.bind(null, bullet.id, pageSlug)} />
            </div>
          );
        })}
        {bullets.length === 0 && <p className="text-small text-neutral">No items added yet.</p>}
      </div>

      <form action={addAction} className="flex items-center gap-3 rounded-card border border-dashed border-neutral-lighter p-3">
        <input name="text" placeholder="New item" required className="admin-input flex-1" />
        <input name="order" type="number" defaultValue={nextOrder} className="admin-input w-20" />
        <SubmitButton pendingText="Adding..." className="px-4 py-1.5">
          Add
        </SubmitButton>
      </form>
    </div>
  );
}
