import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { opportunity } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteOpportunity } from "./actions";

const CATEGORY_LABEL: Record<string, string> = {
  internship: "Internship",
  vacancy: "Vacancy",
  young_professional_programme: "Young Professional Programme",
  other: "Other",
  job: "Job",
  grant: "Grant",
  tender: "Tender",
};

export default async function AdminWorkWithUsPage() {
  const opportunities = await db.select().from(opportunity).orderBy(desc(opportunity.deadline));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Work With Us</h1>
          <p className="mt-1 text-medium text-neutral">Internship, vacancy, and other opportunity listings.</p>
        </div>
        <Link
          href="/admin/work-with-us/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New listing
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Deadline</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {opportunities.map((item) => (
              <tr key={item.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-darkest">{item.title}</td>
                <td className="px-4 py-3 text-neutral-dark">{CATEGORY_LABEL[item.category]}</td>
                <td className="px-4 py-3 text-neutral-dark">
                  {item.deadline ? new Date(item.deadline).toLocaleDateString("en-US") : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      item.status === "active"
                        ? "rounded-badge bg-mountain-meadow-lightest px-2 py-0.5 text-tiny font-semibold text-mountain-meadow-darker"
                        : "rounded-badge bg-neutral-lightest px-2 py-0.5 text-tiny font-semibold text-neutral-dark"
                    }
                  >
                    {item.status === "active" ? "Active" : "Closed"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/work-with-us/${item.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteOpportunity.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {opportunities.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-neutral" colSpan={5}>
                  No listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
