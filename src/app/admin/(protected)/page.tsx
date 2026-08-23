import { count } from "drizzle-orm";
import type { MySqlTable } from "drizzle-orm/mysql-core";
import { db } from "@/db";
import { page, teamMember, blogPost, heroSlide, partner, memberState, contactMethod, subscriber } from "@/db/schema";

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
      <h1 className="text-h3 font-bold text-neutral-darkest">Dashboard</h1>
      <p className="mt-1 text-medium text-neutral">Manage the CECECO site&apos;s content from here.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="rounded-card border border-neutral-lighter bg-white p-5 transition-colors hover:border-mountain-meadow"
          >
            <p className="text-h3 font-bold text-neutral-darkest">{stat.value}</p>
            <p className="text-small text-neutral">{stat.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
