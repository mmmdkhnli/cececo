import type { MediaGalleryImageRow } from "@/db/schema";
import { addGalleryImage, deleteGalleryImage } from "@/app/admin/(protected)/media/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card } from "@/components/admin/ui/card";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";

export function MediaGalleryManager({
  mediaItemId,
  images,
}: {
  mediaItemId: number;
  images: MediaGalleryImageRow[];
}) {
  const addAction = addGalleryImage.bind(null, mediaItemId);
  const nextOrder = images.length === 0 ? 0 : Math.max(...images.map((i) => i.order)) + 1;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h2 className="text-lg font-semibold">Gallery images</h2>

      <div className="flex flex-col gap-4">
        {images.map((img) => (
          <Card key={img.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <img src={img.image} alt="" className="h-16 w-16 rounded-md object-cover" />
              <p className="text-xs text-muted-foreground">order: {img.order}</p>
            </div>
            <DeleteButton action={deleteGalleryImage.bind(null, img.id)} />
          </Card>
        ))}
        {images.length === 0 && <p className="text-sm text-muted-foreground">No images added yet.</p>}
      </div>

      <Card className="flex flex-col gap-4 border-dashed p-4">
        <p className="text-sm font-semibold">Add a new image</p>
        <form action={addAction} className="flex flex-col gap-4">
          <ImageUpload name="image" label="Image" />
          <FormField label="Order">
            <Input name="order" type="number" defaultValue={nextOrder} className="w-24" />
          </FormField>
          <div>
            <SubmitButton pendingText="Adding...">Add</SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
