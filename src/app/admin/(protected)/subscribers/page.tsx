import { desc } from "drizzle-orm";
import { db } from "@/db";
import { subscriber } from "@/db/schema";
import { deleteSubscriber } from "./actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";

export default async function AdminSubscribersPage() {
  const subscribers = await db.select().from(subscriber).orderBy(desc(subscriber.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-bold">Subscribers</h1>
      <p className="mt-1 text-muted-foreground">
        People who subscribed through the &quot;Stay informed&quot; form — {subscribers.length} total.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString("en-US")}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteButton
                    action={deleteSubscriber.bind(null, s.id)}
                    confirmMessage="Are you sure you want to delete this subscriber?"
                  />
                </TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No subscribers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
