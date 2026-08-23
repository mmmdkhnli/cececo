import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { publication } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { deletePublication } from "./actions";

export default async function AdminPublicationsPage() {
  const publications = await db.select().from(publication).orderBy(desc(publication.publishedAt));

  return (
    <div>
      <AdminPageHeader
        title="Publications"
        description="Entries on the Resources → Publications page."
        newHref="/admin/publications/new"
        newLabel="New publication"
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {publications.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-US") : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/publications/${item.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton action={deletePublication.bind(null, item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {publications.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No publications yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
