"use client";

import { useFormStatus } from "react-dom";

function DeleteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-button border border-red-violet-light px-3 py-1.5 text-small font-medium text-red-violet-dark transition-colors hover:bg-red-violet-lightest disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DeleteButton({
  action,
  confirmMessage = "Are you sure you want to delete this?",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <DeleteSubmit />
    </form>
  );
}
