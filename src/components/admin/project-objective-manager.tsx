import type { ProjectObjectiveRow } from "@/db/schema";
import { addProjectObjective, updateProjectObjective, deleteProjectObjective } from "@/app/admin/(protected)/projects/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";

export function ProjectObjectiveManager({
  projectId,
  objectives,
}: {
  projectId: number;
  objectives: ProjectObjectiveRow[];
}) {
  const addAction = addProjectObjective.bind(null, projectId);
  const nextOrder = objectives.length === 0 ? 0 : Math.max(...objectives.map((o) => o.order)) + 1;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <h2 className="text-lg font-semibold">Objectives</h2>

      <div className="flex flex-col gap-3">
        {objectives.map((objective) => {
          const updateAction = updateProjectObjective.bind(null, objective.id);
          return (
            <Card key={objective.id} className="flex flex-row items-center gap-3 p-3">
              <form action={updateAction} className="flex flex-1 items-center gap-3">
                <Input name="text" defaultValue={objective.text} className="flex-1" />
                <Input name="order" type="number" defaultValue={objective.order} className="w-20" />
                <SubmitButton pendingText="Saving..." variant="outline">
                  Save
                </SubmitButton>
              </form>
              <DeleteButton action={deleteProjectObjective.bind(null, objective.id)} />
            </Card>
          );
        })}
        {objectives.length === 0 && <p className="text-sm text-muted-foreground">No objectives added yet.</p>}
      </div>

      <Card className="flex flex-row items-center gap-3 border-dashed p-3">
        <form action={addAction} className="flex flex-1 items-center gap-3">
          <Input name="text" placeholder="New objective" required className="flex-1" />
          <Input name="order" type="number" defaultValue={nextOrder} className="w-20" />
          <SubmitButton pendingText="Adding...">Add</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
