import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/admin/ui/button";

export function AdminPageHeader({
  title,
  description,
  newHref,
  newLabel,
}: {
  title: string;
  description: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
      {newHref && (
        <Button asChild>
          <Link href={newHref}>
            <Plus className="size-4" />
            {newLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
