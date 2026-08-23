import Link from "next/link";
import { count } from "drizzle-orm";
import type { MySqlTable } from "drizzle-orm/mysql-core";
import { db } from "@/db";
import { page, teamMember, blogPost, heroSlide, partner, memberState, contactMethod, subscriber } from "@/db/schema";
import { Card, CardContent } from "@/components/admin/ui/card";

async function getCount(table: MySqlTable) {
  const [row] = await db.select({ value: count() }).from(table);
  return row?.value ?? 0;
}

export default async function AdminDashboardPage() {
  const [pages, members, posts, slides, partners, states, contacts, subscribers] = await Promise.all([
    getCount(page),
    getCount(teamMember),
    getCount(blogPost),
    getCount(heroSlide),
    getCount(partner),
    getCount(memberState),
    getCount(contactMethod),
    getCount(subscriber),
  ]);

  const stats = [
    { label: "Pages", value: pages, href: "/admin/pages" },
    { label: "Hero slides", value: slides, href: "/admin/hero-slides" },
    { label: "Team members", value: members, href: "/admin/team" },
    { label: "Blog posts", value: posts, href: "/admin/blog" },
    { label: "Partners", value: partners, href: "/admin/partners" },
    { label: "Member states", value: states, href: "/admin/partners" },
    { label: "Contact methods", value: contacts, href: "/admin/contact" },
    { label: "Subscribers", value: subscribers, href: "/admin/subscribers" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage the CECECO site&apos;s content from here.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-primary">
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
