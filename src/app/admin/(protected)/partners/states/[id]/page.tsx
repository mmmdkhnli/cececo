import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { memberState } from "@/db/schema";
import { MemberStateForm } from "@/components/admin/member-state-form";
import { updateMemberState } from "../../actions";

export default async function EditMemberStatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select().from(memberState).where(eq(memberState.id, Number(id)));
  if (!row) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold">Edit {row.name}</h1>
      <div className="mt-8">
        <MemberStateForm key={row.id} action={updateMemberState.bind(null, row.id)} defaultValues={row} />
      </div>
    </div>
  );
}
