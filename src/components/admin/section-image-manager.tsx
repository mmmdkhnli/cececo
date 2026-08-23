import type { SectionImageRow } from "@/db/schema";
import { addSectionImage, deleteSectionImage } from "@/app/admin/(protected)/pages/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";

export function SectionImageManager({
  sectionId,
  pageSlug,
  images,
}: {
  sectionId: number;
  pageSlug: string;
  images: SectionImageRow[];
}) {
  const addAction = addSectionImage.bind(null, sectionId, pageSlug);
  const nextOrder = images.length === 0 ? 0 : Math.max(...images.map((i) => i.order)) + 1;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h2 className="text-medium font-semibold text-neutral-darkest">Images</h2>

      <div className="flex flex-col gap-4">
        {images.map((img) => (
          <div key={img.id} className="flex items-center justify-between gap-4 rounded-card border border-neutral-lighter p-4">
            <div className="flex items-center gap-3">
              <img src={img.url} alt={img.altText ?? ""} className="h-16 w-16 rounded-image object-cover" />
              <div>
                <p className="text-small text-neutral-darkest">{img.altText || "(no alt text)"}</p>
                <p className="text-tiny text-neutral">order: {img.order}</p>
              </div>
            </div>
            <DeleteButton action={deleteSectionImage.bind(null, img.id, pageSlug)} />
          </div>
        ))}
        {images.length === 0 && <p className="text-small text-neutral">No images added yet.</p>}
      </div>

      <form action={addAction} className="flex flex-col gap-4 rounded-card border border-dashed border-neutral-lighter p-4">
        <p className="text-small font-semibold text-neutral-darkest">Add a new image</p>
        <ImageUpload name="url" label="Image" />
        <div className="flex flex-col gap-1.5">
          <label className="text-small font-semibold text-neutral-darkest">Alt text</label>
          <input name="altText" className="admin-input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-small font-semibold text-neutral-darkest">Order</label>
          <input name="order" type="number" defaultValue={nextOrder} className="admin-input w-24" />
        </div>
        <div>
          <SubmitButton pendingText="Adding...">Add</SubmitButton>
        </div>
      </form>
    </div>
  );
}
