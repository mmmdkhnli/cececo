import { asc, isNull, eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { navItem } from "@/db/schema";
import { NavItemForm } from "@/components/admin/nav-item-form";
import { updateNavItem } from "../actions";

export default async function EditNavItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select().from(navItem).where(eq(navItem.id, Number(id)));
  if (!row) notFound();

  const parentOptions = await db
    .select({ id: navItem.id, label: navItem.label })
    .from(navItem)
    .where(and(eq(navItem.location, "navbar"), isNull(navItem.parentId)))
    .orderBy(asc(navItem.order));

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Edit {row.label}</h1>
      <div className="mt-8">
        <NavItemForm key={row.id} action={updateNavItem.bind(null, row.id)} defaultValues={row} parentOptions={parentOptions} />
      </div>
    </div>
  );
}
