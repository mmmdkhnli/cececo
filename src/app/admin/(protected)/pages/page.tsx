import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { page, section } from "@/db/schema";
import { Card } from "@/components/admin/ui/card";

export default async function AdminPagesPage() {
  const pages = await db.select().from(page);
  const withCounts = await Promise.all(
    pages.map(async (p) => {
      const [row] = await db.select({ value: count() }).from(section).where(eq(section.pageId, p.id));
      return { ...p, sectionCount: row?.value ?? 0 };
    }),
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">Pages</h1>
      <p className="mt-1 text-muted-foreground">Each page&apos;s sections — heading, scheme, and content fields.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {withCounts.map((p) => (
          <Link key={p.id} href={`/admin/pages/${p.slug}`}>
            <Card className="p-5 transition-colors hover:border-primary">
              <p className="text-lg font-bold">{p.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">/{p.slug === "home" ? "" : p.slug}</p>
              <p className="mt-3 text-sm text-muted-foreground">{p.sectionCount} section(s)</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
