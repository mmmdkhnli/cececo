import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { teamMember } from "@/db/schema";

export async function getTeamMembersByGroup(group: "leadership" | "technical") {
  return db
    .select()
    .from(teamMember)
    .where(eq(teamMember.group, group))
    .orderBy(asc(teamMember.order));
}

export async function getTeamMemberBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(teamMember)
    .where(and(eq(teamMember.slug, slug), eq(teamMember.hasDetailPage, true)));
  return row ?? null;
}
