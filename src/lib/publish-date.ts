import "server-only";

export function resolvePublishedAt(formData: FormData): Date | null {
  if (formData.get("publishMode") === "now") return new Date();
  const raw = String(formData.get("publishedAt") ?? "").trim();
  return raw ? new Date(raw) : null;
}
