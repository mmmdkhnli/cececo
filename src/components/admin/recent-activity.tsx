import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessage, subscriber } from "@/db/schema";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";

export async function RecentActivity() {
  const [messages, subscribers] = await Promise.all([
    db.select().from(contactMessage).orderBy(desc(contactMessage.createdAt)).limit(5),
    db.select().from(subscriber).orderBy(desc(subscriber.createdAt)).limit(5),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent contact messages</CardTitle>
          <CardDescription>Latest submissions from the Contact page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
          {messages.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{m.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">{m.subject}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(m.createdAt).toLocaleDateString("en-US")}
              </span>
            </div>
          ))}
          <Button asChild variant="outline" size="sm" className="mt-1 self-start">
            <Link href="/admin/contact-messages">View all</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent subscribers</CardTitle>
          <CardDescription>Latest newsletter signups.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {subscribers.length === 0 && <p className="text-sm text-muted-foreground">No subscribers yet.</p>}
          {subscribers.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <p className="truncate text-sm font-medium">{s.email}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(s.createdAt).toLocaleDateString("en-US")}
              </span>
            </div>
          ))}
          <Button asChild variant="outline" size="sm" className="mt-1 self-start">
            <Link href="/admin/subscribers">View all</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
