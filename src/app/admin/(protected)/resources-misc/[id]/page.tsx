import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { miscResource } from "@/db/schema";
import { MiscResourceForm } from "@/components/admin/misc-resource-form";
import { updateMiscResource } from "../actions";

export default async function EditMiscResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item] = await db.select().from(miscResource).where(eq(miscResource.id, Number(id)));
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Edit {item.title}</h1>
      <div className="mt-8">
        <MiscResourceForm key={item.id} action={updateMiscResource.bind(null, item.id)} defaultValues={item} />
      </div>
    </div>
  );
}
