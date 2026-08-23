import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessage } from "@/db/schema";
import { deleteContactMessage } from "./actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminContactMessagesPage() {
  const messages = await db.select().from(contactMessage).orderBy(desc(contactMessage.createdAt));

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Contact messages</h1>
      <p className="mt-1 text-medium text-neutral">
        Messages sent through the Contact page&apos;s &quot;Write Us&quot; form — {messages.length} total.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {messages.map((m) => (
          <div key={m.id} className="rounded-card border border-neutral-lighter bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-neutral-darkest">
                  {m.fullName}
                  {m.organization && <span className="font-normal text-neutral"> — {m.organization}</span>}
                </p>
                <p className="text-small text-neutral">{m.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-tiny text-neutral">{new Date(m.createdAt).toLocaleDateString("en-US")}</p>
                <DeleteButton
                  action={deleteContactMessage.bind(null, m.id)}
                  confirmMessage="Are you sure you want to delete this message?"
                />
              </div>
            </div>
            <p className="mt-4 text-small font-semibold text-neutral-darkest">{m.subject}</p>
            <p className="mt-1 text-small whitespace-pre-wrap text-neutral-dark">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="rounded-card border border-neutral-lighter bg-white px-4 py-6 text-center text-small text-neutral">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
