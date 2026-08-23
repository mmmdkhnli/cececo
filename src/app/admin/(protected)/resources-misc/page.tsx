import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { miscResource } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMiscResource } from "./actions";

export default async function AdminMiscResourcesPage() {
  const resources = await db.select().from(miscResource).orderBy(asc(miscResource.order));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Other resources</h1>
          <p className="mt-1 text-medium text-neutral">
            Link cards from the old Resources → Misc page (no longer linked from the site — see Media instead).
          </p>
        </div>
        <Link
          href="/admin/resources-misc/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New resource
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Link</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {resources.map((item) => (
              <tr key={item.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-darkest">{item.title}</td>
                <td className="max-w-xs truncate px-4 py-3 text-neutral-dark">{item.link}</td>
                <td className="px-4 py-3 text-neutral-dark">{item.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/resources-misc/${item.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteMiscResource.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-neutral" colSpan={4}>
                  No resources yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
