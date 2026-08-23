import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { opportunity } from "@/db/schema";
import { OpportunityForm } from "@/components/admin/opportunity-form";
import { updateOpportunity } from "../actions";

export default async function EditWorkWithUsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item] = await db.select().from(opportunity).where(eq(opportunity.id, Number(id)));
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold">Edit {item.title}</h1>
      <div className="mt-8">
        <OpportunityForm key={item.id} action={updateOpportunity.bind(null, item.id)} defaultValues={item} />
      </div>
    </div>
  );
}
