import { asc } from "drizzle-orm";
import { db } from "@/db";
import { contactMethod } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { updateContactMethod, createContactMethod, deleteContactMethod } from "./actions";

export default async function AdminContactPage() {
  const methods = await db.select().from(contactMethod).orderBy(asc(contactMethod.order));

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Contact</h1>
      <p className="mt-1 text-medium text-neutral">
        The &quot;Get in touch&quot; section on the Home page (email/phone/address).
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex flex-col gap-4 rounded-card border border-neutral-lighter bg-white p-5 md:flex-row md:items-end"
          >
            <form
              action={updateContactMethod.bind(null, method.id)}
              className="flex flex-1 flex-col gap-4 md:flex-row md:items-end"
            >
              <div className="w-24 shrink-0 text-small font-semibold text-neutral">{method.type}</div>
              <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
                <input name="title" defaultValue={method.title} required className="admin-input" placeholder="Title" />
                <input
                  name="description"
                  defaultValue={method.description}
                  required
                  className="admin-input"
                  placeholder="Description"
                />
                <input name="value" defaultValue={method.value} required className="admin-input" placeholder="Value" />
              </div>
              <button
                type="submit"
                className="rounded-button bg-mountain-meadow px-4 py-2 font-medium text-white hover:bg-mountain-meadow-dark"
              >
                Save
              </button>
            </form>
            <DeleteButton action={deleteContactMethod.bind(null, method.id)} />
          </div>
        ))}
      </div>

      <details className="mt-8 rounded-card border border-neutral-lighter bg-white p-5">
        <summary className="cursor-pointer text-small font-semibold text-neutral-darkest">+ New contact method</summary>
        <form action={createContactMethod} className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
          <select name="type" className="admin-input md:w-32">
            <option value="email">email</option>
            <option value="phone">phone</option>
            <option value="office">office</option>
          </select>
          <input name="title" required className="admin-input" placeholder="Title" />
          <input name="description" required className="admin-input" placeholder="Description" />
          <input name="value" required className="admin-input" placeholder="Value" />
          <input name="order" type="number" defaultValue={methods.length + 1} className="admin-input md:w-20" />
          <button
            type="submit"
            className="rounded-button bg-mountain-meadow px-4 py-2 font-medium text-white hover:bg-mountain-meadow-dark"
          >
            Add
          </button>
        </form>
      </details>
    </div>
  );
}
