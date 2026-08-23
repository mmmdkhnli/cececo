import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { publication } from "@/db/schema";
import { PublicationForm } from "@/components/admin/publication-form";
import { updatePublication } from "../actions";

export default async function EditPublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item] = await db.select().from(publication).where(eq(publication.id, Number(id)));
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Edit {item.title}</h1>
      <div className="mt-8">
        <PublicationForm key={item.id} action={updatePublication.bind(null, item.id)} defaultValues={item} />
      </div>
    </div>
  );
}
