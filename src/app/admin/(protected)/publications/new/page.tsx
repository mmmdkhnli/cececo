import { PublicationForm } from "@/components/admin/publication-form";
import { createPublication } from "../actions";

export default function NewPublicationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New publication</h1>
      <div className="mt-8">
        <PublicationForm action={createPublication} />
      </div>
    </div>
  );
}
