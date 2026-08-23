import { PartnerForm } from "@/components/admin/partner-form";
import { createPartner } from "../actions";

export default function NewPartnerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New partner</h1>
      <div className="mt-8">
        <PartnerForm action={createPartner} />
      </div>
    </div>
  );
}
