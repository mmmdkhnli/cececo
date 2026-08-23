import { asc, isNull, eq, and } from "drizzle-orm";
import { db } from "@/db";
import { navItem } from "@/db/schema";
import { NavItemForm } from "@/components/admin/nav-item-form";
import { createNavItem } from "../actions";

export default async function NewNavItemPage() {
  const parentOptions = await db
    .select({ id: navItem.id, label: navItem.label })
    .from(navItem)
    .where(and(eq(navItem.location, "navbar"), isNull(navItem.parentId)))
    .orderBy(asc(navItem.order));

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">New link</h1>
      <div className="mt-8">
        <NavItemForm action={createNavItem} parentOptions={parentOptions} />
      </div>
    </div>
  );
}
