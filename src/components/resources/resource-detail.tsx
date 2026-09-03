import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/shared/rich-text";
import { ArrowDownward, Description, Visibility } from "relume-icons";
import type { PublicationRow } from "@/db/schema";

function formatSize(bytes: number | null) {
  if (!bytes) return null;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const METADATA_LABEL: Record<string, string> = {
  publishedBy: "Published by",
  pages: "Pages",
  language: "Language",
  fileFormat: "Format",
};

export function ResourceDetail({ item }: { item: PublicationRow }) {
  const metadata = [
    ["publishedBy", item.publishedBy] as const,
    ["pages", item.pages ? String(item.pages) : null] as const,
    ["language", item.language] as const,
    ["fileFormat", item.fileFormat] as const,
  ].filter(([, value]) => value);

  return (
    <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
      <div className="container max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Badge>{item.category}</Badge>
          {item.publishedAt && (
            <p className="text-small text-scheme-text-muted">
              {new Date(item.publishedAt).toLocaleDateString("en-US")}
            </p>
          )}
        </div>
        <h1 className="mb-6 text-h1 font-bold">{item.title}</h1>
        {item.coverImage && (
          <img
            src={item.coverImage}
            alt=""
            className="mb-10 aspect-[16/9] w-full rounded-image object-cover"
          />
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-medium text-scheme-text-muted">{item.excerpt}</p>
            {item.body && (
              <div className="mt-8">
                <h2 className="mb-3 text-h5 font-bold">
                  About this{" "}
                  {item.category === "Report"
                    ? "Report"
                    : item.category === "Document"
                      ? "Document"
                      : "Publication"}
                </h2>
                <RichText html={item.body} className="text-medium" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {item.fileUrl && (
              <Card className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Description className="size-6 shrink-0 text-scheme-accent" />
                  <div className="min-w-0">
                    <p className="truncate text-small font-semibold text-scheme-text">
                      {item.fileUrl.split("/").pop()}
                    </p>
                    {formatSize(item.fileSizeBytes) && (
                      <p className="text-tiny text-scheme-text-muted">
                        {formatSize(item.fileSizeBytes)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    asChild
                    iconLeft={<ArrowDownward className="size-4" />}
                  >
                    <a href={item.fileUrl} download>
                      Download {item.fileFormat === "Word" ? "File" : "PDF"}
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    iconLeft={<Visibility className="size-4" />}
                  >
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Online
                    </a>
                  </Button>
                </div>
              </Card>
            )}

            {metadata.length > 0 && (
              <Card className="p-5">
                <h3 className="mb-4 text-small font-bold text-scheme-text">
                  Details
                </h3>
                <dl className="flex flex-col gap-3">
                  {metadata.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 text-small"
                    >
                      <dt className="text-scheme-text-muted">{METADATA_LABEL[key]}</dt>
                      <dd className="font-medium text-scheme-text">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
