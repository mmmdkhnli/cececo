import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { publication } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePublication } from "./actions";

export default async function AdminPublicationsPage() {
  const publications = await db.select().from(publication).orderBy(desc(publication.publishedAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Publications</h1>
          <p className="mt-1 text-medium text-neutral">Entries on the Resources → Publications page.</p>
        </div>
        <Link
          href="/admin/publications/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New publication
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {publications.map((item) => (
              <tr key={item.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-darkest">{item.title}</td>
                <td className="px-4 py-3 text-neutral-dark">{item.category}</td>
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
                <td className="px-4 py-3 text-neutral-dark">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-US") : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/publications/${item.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deletePublication.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {publications.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-neutral" colSpan={5}>
                  No publications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
