import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { miscResource } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { deleteMiscResource } from "./actions";

export default async function AdminMiscResourcesPage() {
  const resources = await db.select().from(miscResource).orderBy(asc(miscResource.order));

  return (
    <div>
      <AdminPageHeader
        title="Other resources"
        description="Link cards from the old Resources → Misc page (no longer linked from the site — see Media instead)."
        newHref="/admin/resources-misc/new"
        newLabel="New resource"
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Order</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{item.link}</TableCell>
                <TableCell className="text-muted-foreground">{item.order}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/resources-misc/${item.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton action={deleteMiscResource.bind(null, item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {resources.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No resources yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
