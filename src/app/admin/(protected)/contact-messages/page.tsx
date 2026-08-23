import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessage } from "@/db/schema";
import { deleteContactMessage } from "./actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Card } from "@/components/admin/ui/card";

export default async function AdminContactMessagesPage() {
  const messages = await db.select().from(contactMessage).orderBy(desc(contactMessage.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-bold">Contact messages</h1>
      <p className="mt-1 text-muted-foreground">
        Messages sent through the Contact page&apos;s &quot;Write Us&quot; form — {messages.length} total.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {messages.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {m.fullName}
                  {m.organization && <span className="font-normal text-muted-foreground"> — {m.organization}</span>}
                </p>
                <p className="text-sm text-muted-foreground">{m.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString("en-US")}</p>
                <DeleteButton
                  action={deleteContactMessage.bind(null, m.id)}
                  confirmMessage="Are you sure you want to delete this message?"
                />
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold">{m.subject}</p>
            <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">{m.message}</p>
          </Card>
        ))}
        {messages.length === 0 && (
          <Card className="px-4 py-6 text-center text-sm text-muted-foreground">No messages yet.</Card>
        )}
      </div>
    </div>
  );
}
