import { MiscResourceForm } from "@/components/admin/misc-resource-form";
import { createMiscResource } from "../actions";

export default function NewMiscResourcePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New resource</h1>
      <div className="mt-8">
        <MiscResourceForm action={createMiscResource} />
      </div>
    </div>
  );
}
