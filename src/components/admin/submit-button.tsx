"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

// useFormStatus reads the pending state of the nearest ancestor <form> —
// works whether that form's action is a plain server action function or
// one bound via useActionState — so this one component gives every admin
// form a real "in flight" indicator without threading pending state
// through each form individually.
export function SubmitButton({
  children,
  pendingText = "Saving...",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "rounded-button bg-mountain-meadow px-5 py-2.5 font-medium text-white transition-colors hover:bg-mountain-meadow-dark disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}
