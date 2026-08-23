import { cn } from "@/lib/utils";

// Renders HTML produced by the admin's rich text editor (src/components/admin/rich-text-editor.tsx).
export function RichText({ html, className }: { html: string | null | undefined; className?: string }) {
  if (!html) return null;
  return <div className={cn("rich-text", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
