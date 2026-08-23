import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { mediaItem } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
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
      <AdminPageHeader
        title="Media"
        description="Photos/videos/press materials on the Resources → Media page."
        newHref="/admin/media/new"
        newLabel="New media"
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt="" className="h-10 w-14 rounded object-cover" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground">{TYPE_LABEL[item.type] ?? item.type}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/media/${item.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton action={deleteMediaItem.bind(null, item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No media added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
