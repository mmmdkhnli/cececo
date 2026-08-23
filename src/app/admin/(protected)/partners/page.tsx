import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { memberState, partner } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { deletePartner, deleteMemberState } from "./actions";

const CATEGORY_LABEL: Record<string, string> = {
  institutional_strategic: "Institutional & Strategic",
  knowledge_development: "Knowledge & Development",
  events_initiatives: "Events & Initiatives",
};

export default async function AdminPartnersPage() {
  const [states, partners] = await Promise.all([
    db.select().from(memberState).orderBy(asc(memberState.order)),
    db.select().from(partner).orderBy(asc(partner.order)),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <AdminPageHeader
          title="ECO Member States"
          description="The flag list on the Home and Partners pages."
          newHref="/admin/partners/states/new"
          newLabel="New country"
        />
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Signatory</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {states.map((state) => (
                <TableRow key={state.id}>
                  <TableCell>
                    {state.flagImage && (
                      <img src={state.flagImage} alt="" className="h-6 w-10 rounded object-cover" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{state.name}</TableCell>
                  <TableCell className="text-muted-foreground">{state.isSignatory ? "Yes" : "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/partners/states/${state.id}`}>Edit</Link>
                      </Button>
                      <DeleteButton action={deleteMemberState.bind(null, state.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <AdminPageHeader
          title="Partners"
          description="The logo list on the Home and Partners pages."
          newHref="/admin/partners/new"
          newLabel="New partner"
        />
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Link</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.logoImage && (
                      <img src={p.logoImage} alt="" className="h-8 w-auto max-w-16 object-contain" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{CATEGORY_LABEL[p.category] ?? p.category}</TableCell>
                  <TableCell className="text-muted-foreground">{p.link ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/partners/${p.id}`}>Edit</Link>
                      </Button>
                      <DeleteButton action={deletePartner.bind(null, p.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
