"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

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
