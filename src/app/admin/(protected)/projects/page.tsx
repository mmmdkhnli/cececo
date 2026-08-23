import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { project } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProject } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

const STATUS_BADGE: Record<string, string> = {
  ongoing: "bg-mountain-meadow-lightest text-mountain-meadow-darker",
  upcoming: "bg-neutral-lightest text-neutral-dark",
  completed: "bg-neutral-lighter text-neutral-darkest",
};

export default async function AdminProjectsPage() {
  const projects = await db.select().from(project).orderBy(asc(project.order));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Projects</h1>
          <p className="mt-1 text-medium text-neutral">Projects shown on the listing and detail pages.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New project
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Regional</th>
              <th className="px-4 py-3 font-semibold">Applications</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((item) => (
              <tr key={item.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-darkest">{item.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-badge px-2 py-0.5 text-tiny font-semibold ${STATUS_BADGE[item.status]}`}
                  >
                    {STATUS_LABEL[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-dark">{item.isRegionalInitiative ? "Yes" : "—"}</td>
                <td className="px-4 py-3 text-neutral-dark">{item.applicationsOpen ? "Open" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/projects/${item.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteProject.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-neutral" colSpan={5}>
                  No projects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
