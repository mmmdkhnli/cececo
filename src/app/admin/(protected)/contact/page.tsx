import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { contactMethod } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card } from "@/components/admin/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/admin/ui/collapsible";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { updateContactMethod, createContactMethod, deleteContactMethod } from "./actions";

export default async function AdminContactPage() {
  const methods = await db.select().from(contactMethod).orderBy(asc(contactMethod.order));

  return (
    <div>
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-1 text-muted-foreground">
        The &quot;Get in touch&quot; section on the Home page (email/phone/address). Email opens a mail app and phone
        dials by default; an office address links to a Google Maps search for it unless you set a link of its own
        here.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {methods.map((method) => (
          <Card key={method.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-end">
            <form
              action={updateContactMethod.bind(null, method.id)}
              className="flex flex-1 flex-col gap-4 md:flex-row md:items-end"
            >
              <div className="w-24 shrink-0 text-sm font-semibold text-muted-foreground">{method.type}</div>
              <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-4">
                <Input name="title" defaultValue={method.title} required placeholder="Title" />
                <Input name="description" defaultValue={method.description} required placeholder="Description" />
                <Input name="value" defaultValue={method.value} required placeholder="Value" />
                <Input
                  name="link"
                  defaultValue={method.link ?? ""}
                  placeholder={method.type === "office" ? "Map link (optional)" : "Link (optional)"}
                />
              </div>
              <SubmitButton>Save</SubmitButton>
            </form>
            <DeleteButton action={deleteContactMethod.bind(null, method.id)} />
          </Card>
        ))}
      </div>

      <Collapsible className="mt-8">
        <Card className="p-5">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-semibold">
            <Plus className="size-4" />
            New contact method
          </CollapsibleTrigger>
          <CollapsibleContent>
            <form action={createContactMethod} className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
              <Select name="type" defaultValue="email">
                <SelectTrigger className="md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">email</SelectItem>
                  <SelectItem value="phone">phone</SelectItem>
                  <SelectItem value="office">office</SelectItem>
                </SelectContent>
              </Select>
              <Input name="title" required placeholder="Title" />
              <Input name="description" required placeholder="Description" />
              <Input name="value" required placeholder="Value" />
              <Input name="link" placeholder="Link (optional)" />
              <Input name="order" type="number" defaultValue={methods.length + 1} className="md:w-20" />
              <SubmitButton pendingText="Adding...">Add</SubmitButton>
            </form>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
