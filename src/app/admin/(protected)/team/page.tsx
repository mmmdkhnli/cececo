import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { teamMember } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { deleteTeamMember } from "./actions";

export default async function AdminTeamPage() {
  const members = await db.select().from(teamMember).orderBy(asc(teamMember.group), asc(teamMember.order));

  return (
    <div>
      <AdminPageHeader
        title="Team"
        description="Team members on the Team page."
        newHref="/admin/team/new"
        newLabel="New member"
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.role}</TableCell>
                <TableCell className="text-muted-foreground">{member.group}</TableCell>
                <TableCell>
                  <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/team/${member.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton action={deleteTeamMember.bind(null, member.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
