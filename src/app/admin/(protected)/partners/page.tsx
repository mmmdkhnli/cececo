import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { memberState, partner } from "@/db/schema";
import { DeleteButton } from "@/components/admin/delete-button";
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h3 font-bold text-neutral-darkest">
              ECO Member States
            </h1>
            <p className="mt-1 text-medium text-neutral">
              The flag list on the Home and Partners pages.
            </p>
          </div>
          <Link
            href="/admin/partners/states/new"
            className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
          >
            + New country
          </Link>
        </div>
        <div className="mt-6 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-neutral-lighter text-neutral">
                <th className="px-4 py-3 font-semibold">Flag</th>
                <th className="px-4 py-3 font-semibold">Country</th>
                <th className="px-4 py-3 font-semibold">Signatory</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr
                  key={state.id}
                  className="border-b border-neutral-lighter last:border-0"
                >
                  <td className="px-4 py-3">
                    {state.flagImage && (
                      <img
                        src={state.flagImage}
                        alt=""
                        className="h-6 w-10 rounded object-cover"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-darkest">
                    {state.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-dark">
                    {state.isSignatory ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/partners/states/${state.id}`}
                        className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteMemberState.bind(null, state.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h3 font-bold text-neutral-darkest">
              Partners
            </h1>
            <p className="mt-1 text-medium text-neutral">
              The logo list on the Home and Partners pages.
            </p>
          </div>
          <Link
            href="/admin/partners/new"
            className="rounded-button bg-mountain-meadow px-4 py-2.5 font-medium text-white hover:bg-mountain-meadow-dark"
          >
            + New partner
          </Link>
        </div>
        <div className="mt-6 overflow-x-auto rounded-card border border-neutral-lighter bg-white">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-neutral-lighter text-neutral">
                <th className="px-4 py-3 font-semibold">Logo</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Link</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-neutral-lighter last:border-0"
                >
                  <td className="px-4 py-3">
                    {p.logoImage && (
                      <img
                        src={p.logoImage}
                        alt=""
                        className="h-8 w-auto max-w-16 object-contain"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-darkest">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-neutral-dark">
                    {CATEGORY_LABEL[p.category] ?? p.category}
                  </td>
                  <td className="px-4 py-3 text-neutral-dark">
                    {p.link ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/partners/${p.id}`}
                        className="rounded-button border border-neutral-lighter px-3 py-1.5 font-medium text-neutral-darkest hover:bg-neutral-lightest"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deletePartner.bind(null, p.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
