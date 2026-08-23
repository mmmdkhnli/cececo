import type { ProjectObjectiveRow } from "@/db/schema";
import { addProjectObjective, updateProjectObjective, deleteProjectObjective } from "@/app/admin/(protected)/projects/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";

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
      <h2 className="text-medium font-semibold text-neutral-darkest">Objectives</h2>

      <div className="flex flex-col gap-3">
        {objectives.map((objective) => {
          const updateAction = updateProjectObjective.bind(null, objective.id);
          return (
            <div
              key={objective.id}
              className="flex items-center gap-3 rounded-card border border-neutral-lighter p-3"
            >
              <form action={updateAction} className="flex flex-1 items-center gap-3">
                <input name="text" defaultValue={objective.text} className="admin-input flex-1" />
                <input name="order" type="number" defaultValue={objective.order} className="admin-input w-20" />
                <SubmitButton
                  pendingText="Saving..."
                  className="border border-mountain-meadow bg-transparent px-3 py-1.5 text-mountain-meadow-dark hover:bg-mountain-meadow-lightest"
                >
                  Save
                </SubmitButton>
              </form>
              <DeleteButton action={deleteProjectObjective.bind(null, objective.id)} />
            </div>
          );
        })}
        {objectives.length === 0 && <p className="text-small text-neutral">No objectives added yet.</p>}
      </div>

      <form action={addAction} className="flex items-center gap-3 rounded-card border border-dashed border-neutral-lighter p-3">
        <input name="text" placeholder="New objective" required className="admin-input flex-1" />
        <input name="order" type="number" defaultValue={nextOrder} className="admin-input w-20" />
        <SubmitButton pendingText="Adding..." className="px-4 py-1.5">
          Add
        </SubmitButton>
      </form>
    </div>
  );
}
