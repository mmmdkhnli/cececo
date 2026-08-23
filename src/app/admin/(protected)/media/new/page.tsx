import { MediaItemForm } from "@/components/admin/media-item-form";
import { createMediaItem } from "../actions";

export default function NewMediaItemPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New media</h1>
      <div className="mt-8">
        <MediaItemForm action={createMediaItem} />
      </div>
    </div>
  );
}
