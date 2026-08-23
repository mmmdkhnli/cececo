import { desc } from "drizzle-orm";
import { db } from "@/db";
import { subscriber } from "@/db/schema";
import { deleteSubscriber } from "./actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminSubscribersPage() {
  const subscribers = await db.select().from(subscriber).orderBy(desc(subscriber.createdAt));

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Subscribers</h1>
      <p className="mt-1 text-medium text-neutral">
        People who subscribed through the &quot;Stay informed&quot; form — {subscribers.length} total.
      </p>

      <div className="mt-8 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-neutral-lighter text-neutral">
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-neutral-lighter last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-darkest">{s.email}</td>
                <td className="px-4 py-3 text-neutral-dark">
                  {new Date(s.createdAt).toLocaleDateString("en-US")}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    action={deleteSubscriber.bind(null, s.id)}
                    confirmMessage="Are you sure you want to delete this subscriber?"
                  />
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-neutral" colSpan={3}>
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
