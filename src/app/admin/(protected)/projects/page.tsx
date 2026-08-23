import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { project } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { deleteProject } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  ongoing: "default",
  upcoming: "secondary",
  completed: "outline",
};

export default async function AdminProjectsPage() {
  const projects = await db.select().from(project).orderBy(asc(project.order));

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Projects shown on the listing and detail pages."
        newHref="/admin/projects/new"
        newLabel="New project"
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Regional</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.isRegionalInitiative ? "Yes" : "—"}</TableCell>
                <TableCell className="text-muted-foreground">{item.applicationsOpen ? "Open" : "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/projects/${item.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton action={deleteProject.bind(null, item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No projects yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
