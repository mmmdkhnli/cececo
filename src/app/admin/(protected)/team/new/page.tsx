import { TeamMemberForm } from "@/components/admin/team-member-form";
import { createTeamMember } from "../actions";

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">New team member</h1>
      <div className="mt-8">
        <TeamMemberForm action={createTeamMember} />
      </div>
    </div>
  );
}
