import Link from "next/link";
import { count } from "drizzle-orm";
import type { MySqlTable } from "drizzle-orm/mysql-core";
import { db } from "@/db";
import { page, teamMember, blogPost, heroSlide, partner, memberState, contactMethod, subscriber } from "@/db/schema";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/admin/ui/card";

async function getCount(table: MySqlTable) {
  const [row] = await db.select({ value: count() }).from(table);
  return row?.value ?? 0;
}

export async function SectionCards() {
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
    { label: "Pages", value: pages, href: "/admin/pages", hint: "Editable site pages" },
    { label: "Team members", value: members, href: "/admin/team", hint: "Leadership & technical" },
    { label: "Blog / News", value: posts, href: "/admin/blog", hint: "Published & drafts" },
    { label: "Hero slides", value: slides, href: "/admin/hero-slides", hint: "Home page carousel" },
    { label: "Partners", value: partners, href: "/admin/partners", hint: "Logo list" },
    { label: "Member states", value: states, href: "/admin/partners", hint: "Flag list" },
    { label: "Contact methods", value: contacts, href: "/admin/contact", hint: "Get in touch section" },
    { label: "Subscribers", value: subscribers, href: "/admin/subscribers", hint: "Newsletter signups" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {stats.map((stat) => (
        <Card key={stat.label} className="@container/card">
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stat.value}
            </CardTitle>
            <CardAction>
              <Link href={stat.href} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                Manage
              </Link>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{stat.hint}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
