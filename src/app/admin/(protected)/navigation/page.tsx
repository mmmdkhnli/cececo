import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { navItem } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteNavItem } from "./actions";

export default async function AdminNavigationPage() {
  const items = await db.select().from(navItem).orderBy(asc(navItem.location), asc(navItem.order));
  const byId = new Map(items.map((i) => [i.id, i]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Navigation</h1>
          <p className="mt-1 text-medium text-neutral">Navbar and footer links.</p>
        </div>
        <Link
          href="/admin/navigation/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New link
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Label</th>
              <th className="px-4 py-3 font-semibold">Href</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Group / Parent</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-darkest">{item.label}</td>
                <td className="px-4 py-3 text-neutral-dark">{item.href}</td>
                <td className="px-4 py-3 text-neutral-dark">{item.location}</td>
                <td className="px-4 py-3 text-neutral-dark">
                  {item.parentId ? `↳ ${byId.get(item.parentId)?.label ?? item.parentId}` : (item.group ?? "—")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/navigation/${item.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteNavItem.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
