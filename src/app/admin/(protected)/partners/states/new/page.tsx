import { MemberStateForm } from "@/components/admin/member-state-form";
import { createMemberState } from "../../actions";

export default function NewMemberStatePage() {
  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">New member state</h1>
      <div className="mt-8">
        <MemberStateForm action={createMemberState} />
      </div>
    </div>
  );
}
