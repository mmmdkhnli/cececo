import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { navItem, siteSettings } from "@/db/schema";

export async function getSiteSettings() {
  const [row] = await db.select().from(siteSettings).limit(1);
  return row ?? null;
}

export type NavLink = {
  id: number;
  label: string;
  href: string;
  order: number;
  children: NavLink[];
};

export async function getNavbarLinks(): Promise<NavLink[]> {
  const rows = await db
    .select()
    .from(navItem)
    .where(eq(navItem.location, "navbar"))
    .orderBy(asc(navItem.order));

  const byId = new Map<number, NavLink>();
  const roots: NavLink[] = [];

  for (const row of rows) {
    byId.set(row.id, { id: row.id, label: row.label, href: row.href, order: row.order, children: [] });
  }
  for (const row of rows) {
    const node = byId.get(row.id)!;
    if (row.parentId && byId.has(row.parentId)) {
      byId.get(row.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export type FooterGroup = {
  group: string;
  links: { id: number; label: string; href: string; icon: string | null }[];
};

export async function getFooterGroups(): Promise<FooterGroup[]> {
  const rows = await db
    .select()
    .from(navItem)
    .where(eq(navItem.location, "footer"))
    .orderBy(asc(navItem.order));

  const groups = new Map<string, FooterGroup>();
  for (const row of rows) {
    const key = row.group ?? "other";
    if (!groups.has(key)) groups.set(key, { group: key, links: [] });
    groups.get(key)!.links.push({ id: row.id, label: row.label, href: row.href, icon: row.icon });
  }
  return Array.from(groups.values());
}
