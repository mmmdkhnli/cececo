import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { heroSlide } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { deleteHeroSlide } from "./actions";

export default async function AdminHeroSlidesPage() {
  const slides = await db.select().from(heroSlide).orderBy(asc(heroSlide.order));

  return (
    <div>
      <AdminPageHeader
        title="Hero slides"
        description="The carousel at the top of the Home page."
        newHref="/admin/hero-slides/new"
        newLabel="New slide"
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>See more</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  {slide.backgroundImage && (
                    <img src={slide.backgroundImage} alt="" className="h-10 w-16 rounded object-cover" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{slide.title}</TableCell>
                <TableCell className="text-muted-foreground">{slide.order}</TableCell>
                <TableCell className="text-muted-foreground">{slide.seeMoreEnabled ? "Yes" : "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/hero-slides/${slide.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton action={deleteHeroSlide.bind(null, slide.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {slides.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No slides added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
