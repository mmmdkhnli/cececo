import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New project</h1>
      <div className="mt-8">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
