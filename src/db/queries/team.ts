import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { teamMember } from "@/db/schema";

export async function getTeamMembersByGroup(group: "leadership" | "technical") {
  return db
    .select()
    .from(teamMember)
    .where(eq(teamMember.group, group))
    .orderBy(asc(teamMember.order));
}
