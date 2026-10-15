import Link from "next/link";
import { PageSettingsForm } from "@/components/admin/page-settings-form";
import { createPage } from "../actions";

export default function NewPagePage() {
  return (
    <div>
      <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground">
        ← All pages
      </Link>
      <h1 className="mt-2 text-3xl font-bold">New page</h1>
      <p className="mt-1 text-muted-foreground">
        The page starts with a hero banner and a rich-content section; you can add more sections after
        creating it.
      </p>
      <div className="mt-8">
        <PageSettingsForm action={createPage} />
      </div>
    </div>
  );
}
