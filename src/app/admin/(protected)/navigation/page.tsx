import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { navItem } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { Badge } from "@/components/admin/ui/badge";
import { SubmitButton } from "@/components/admin/submit-button";
import { isLockedNavHref } from "@/lib/custom-pages";
import { deleteNavItem, setNavItemHidden } from "./actions";

export default async function AdminNavigationPage() {
  const items = await db.select().from(navItem).orderBy(asc(navItem.location), asc(navItem.order));
  const byId = new Map(items.map((i) => [i.id, i]));

  return (
    <div>
      <AdminPageHeader
        title="Navigation"
        description="Navbar and footer links. Links to pages built in code (and dropdown menus) can only be hidden; links to pages created in Admin → Pages and external links can be deleted."
        newHref="/admin/navigation/new"
        newLabel="New link"
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Href</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Group / Parent</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className={item.hidden ? "opacity-60" : undefined}>
                <TableCell className="font-medium">
                  {item.label}
                  {item.hidden && (
                    <Badge variant="secondary" className="ml-2">
                      Hidden
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{item.href}</TableCell>
                <TableCell className="text-muted-foreground">{item.location}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.parentId ? `↳ ${byId.get(item.parentId)?.label ?? item.parentId}` : (item.group ?? "—")}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/navigation/${item.id}`}>Edit</Link>
                    </Button>
                    <form action={setNavItemHidden.bind(null, item.id, !item.hidden)}>
                      <SubmitButton variant="outline" className="h-8 px-3" pendingText={item.hidden ? "Showing..." : "Hiding..."}>
                        {item.hidden ? "Show" : "Hide"}
                      </SubmitButton>
                    </form>
                    {!isLockedNavHref(item.href) && <DeleteButton action={deleteNavItem.bind(null, item.id)} />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
