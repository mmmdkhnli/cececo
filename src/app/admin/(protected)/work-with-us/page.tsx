import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { opportunity } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
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
      <AdminPageHeader
        title="Work With Us"
        description="Internship, vacancy, and other opportunity listings."
        newHref="/admin/work-with-us/new"
        newLabel="New listing"
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground">{CATEGORY_LABEL[item.category]}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.deadline ? new Date(item.deadline).toLocaleDateString("en-US") : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === "active" ? "default" : "secondary"}>
                    {item.status === "active" ? "Active" : "Closed"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/work-with-us/${item.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton action={deleteOpportunity.bind(null, item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {opportunities.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No listings yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
