import "server-only";

// PublishDateField submits either publishMode="now" (no publishedAt field
// at all — use the server's current moment) or publishMode="manual" with a
// full datetime-local value (date + time + seconds), so backdating a post
// to its real historical publish date doesn't silently lose precision the
// way the old bare `type="date"` input did.
export function resolvePublishedAt(formData: FormData): Date | null {
  if (formData.get("publishMode") === "now") return new Date();
  const raw = String(formData.get("publishedAt") ?? "").trim();
  return raw ? new Date(raw) : null;
}
