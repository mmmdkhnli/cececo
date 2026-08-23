import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { partner } from "@/db/schema";
import { PartnerForm } from "@/components/admin/partner-form";
import { updatePartner } from "../actions";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select().from(partner).where(eq(partner.id, Number(id)));
  if (!row) notFound();

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Edit {row.name}</h1>
      <div className="mt-8">
        <PartnerForm key={row.id} action={updatePartner.bind(null, row.id)} defaultValues={row} />
      </div>
    </div>
  );
}
