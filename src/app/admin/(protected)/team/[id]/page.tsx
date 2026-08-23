import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { teamMember } from "@/db/schema";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { updateTeamMember } from "../actions";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member] = await db.select().from(teamMember).where(eq(teamMember.id, Number(id)));
  if (!member) notFound();

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Edit {member.name}</h1>
      <div className="mt-8">
        <TeamMemberForm key={member.id} action={updateTeamMember.bind(null, member.id)} defaultValues={member} />
      </div>
    </div>
  );
}
