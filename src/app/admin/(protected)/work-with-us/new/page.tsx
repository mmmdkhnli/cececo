import { OpportunityForm } from "@/components/admin/opportunity-form";
import { createOpportunity } from "../actions";

export default function NewWorkWithUsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New listing</h1>
      <div className="mt-8">
        <OpportunityForm action={createOpportunity} />
      </div>
    </div>
  );
}
