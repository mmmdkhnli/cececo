import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { mediaItem } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMediaItem } from "./actions";

const TYPE_LABEL: Record<string, string> = {
  photo_gallery: "Photo Gallery",
  video: "Video",
  press: "Press Material",
};

export default async function AdminMediaPage() {
  const items = await db
    .select()
    .from(mediaItem)
    .orderBy(desc(mediaItem.eventDate), asc(mediaItem.order));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Media</h1>
          <p className="mt-1 text-medium text-neutral">
            Photos/videos/press materials on the Resources → Media page.
          </p>
        </div>
        <Link
          href="/admin/media/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New media
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Thumbnail</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-neutral-lighter last:border-0"
              >
                <td className="px-4 py-3">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="h-10 w-14 rounded object-cover"
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-darkest">
                  {item.title}
                </td>
                <td className="px-4 py-3 text-neutral-dark">
                  {TYPE_LABEL[item.type] ?? item.type}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      item.status === "published"
                        ? "rounded-badge bg-mountain-meadow-lightest px-2 py-0.5 text-tiny font-semibold text-mountain-meadow-darker"
                        : "rounded-badge bg-neutral-lightest px-2 py-0.5 text-tiny font-semibold text-neutral-dark"
                    }
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/media/${item.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteMediaItem.bind(null, item.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-neutral" colSpan={5}>
                  No media added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
