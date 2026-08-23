import { PublicationForm } from "@/components/admin/publication-form";
import { createPublication } from "../actions";

export default function NewPublicationPage() {
  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">New publication</h1>
      <div className="mt-8">
        <PublicationForm action={createPublication} />
      </div>
    </div>
  );
}
