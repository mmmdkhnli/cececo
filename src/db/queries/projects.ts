import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { project, projectObjective, type ProjectRow, type ProjectObjectiveRow } from "@/db/schema";

export type ProjectWithObjectives = ProjectRow & { objectives: ProjectObjectiveRow[] };

export async function getProjects() {
  return db.select().from(project).orderBy(asc(project.order));
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithObjectives | null> {
  const [row] = await db.select().from(project).where(eq(project.slug, slug));
  if (!row) return null;

  const objectives = await db
    .select()
    .from(projectObjective)
    .where(eq(projectObjective.projectId, row.id))
    .orderBy(asc(projectObjective.order));

  return { ...row, objectives };
}
