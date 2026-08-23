import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { project, projectObjective } from "@/db/schema";
import { ProjectForm } from "@/components/admin/project-form";
import { ProjectObjectiveManager } from "@/components/admin/project-objective-manager";
import { updateProject } from "../actions";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);
  const [item] = await db.select().from(project).where(eq(project.id, projectId));
  if (!item) notFound();

  const objectives = await db
    .select()
    .from(projectObjective)
    .where(eq(projectObjective.projectId, projectId))
    .orderBy(asc(projectObjective.order));

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold">Edit {item.title}</h1>
        <div className="mt-8">
          <ProjectForm key={item.id} action={updateProject.bind(null, item.id)} defaultValues={item} />
        </div>
      </div>
      <ProjectObjectiveManager projectId={item.id} objectives={objectives} />
    </div>
  );
}
