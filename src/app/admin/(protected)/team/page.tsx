import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { teamMember } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTeamMember } from "./actions";

export default async function AdminTeamPage() {
  const members = await db.select().from(teamMember).orderBy(asc(teamMember.group), asc(teamMember.order));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-darkest">Team</h1>
          <p className="mt-1 text-medium text-neutral">Team members on the Team page.</p>
        </div>
        <Link
          href="/admin/team/new"
          className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
        >
          + New member
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Group</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-darkest">{member.name}</td>
                <td className="px-4 py-3 text-neutral-dark">{member.role}</td>
                <td className="px-4 py-3 text-neutral-dark">{member.group}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      member.status === "active"
                        ? "rounded-badge bg-mountain-meadow-lightest px-2 py-0.5 text-tiny font-semibold text-mountain-meadow-darker"
                        : "rounded-badge bg-jaffa-lightest px-2 py-0.5 text-tiny font-semibold text-jaffa-darker"
                    }
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/team/${member.id}`}
                      className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteTeamMember.bind(null, member.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
