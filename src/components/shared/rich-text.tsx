import { cn } from "@/lib/utils";

export function RichText({
  html,
  className,
  ...rest
}: { html: string | null | undefined; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  if (!html) return null;
  return <div className={cn("rich-text", className)} dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}
